"""
Budget models for WAYNEX.
Budget profiles and AI-generated recommendations.
"""
from django.conf import settings
from django.db import models

from core.models import BaseModel


class BudgetProfile(BaseModel):
    """User's budget planning profile."""

    TRAVEL_TYPE_CHOICES = [
        ('solo', 'Solo'),
        ('couple', 'Couple'),
        ('family', 'Family'),
        ('group', 'Group'),
        ('business', 'Business'),
    ]

    TRANSPORT_PREF_CHOICES = [
        ('budget', 'Budget'),
        ('comfort', 'Comfort'),
        ('luxury', 'Luxury'),
        ('any', 'Any'),
    ]

    ACCOMMODATION_PREF_CHOICES = [
        ('hostel', 'Hostel'),
        ('budget_hotel', 'Budget Hotel'),
        ('mid_range', 'Mid-range Hotel'),
        ('luxury', 'Luxury Hotel'),
        ('homestay', 'Homestay'),
        ('any', 'Any'),
    ]

    FOOD_PREF_CHOICES = [
        ('street_food', 'Street Food'),
        ('local_restaurants', 'Local Restaurants'),
        ('mid_range', 'Mid-range Dining'),
        ('fine_dining', 'Fine Dining'),
        ('any', 'Any'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='budget_profiles',
    )
    starting_location = models.CharField(max_length=200)
    budget_amount = models.DecimalField(
        max_digits=12, decimal_places=2,
        help_text='Total budget in INR.',
    )
    num_days = models.PositiveIntegerField(default=3)
    num_travellers = models.PositiveIntegerField(default=1)
    travel_type = models.CharField(
        max_length=20, choices=TRAVEL_TYPE_CHOICES, default='solo',
    )
    transport_pref = models.CharField(
        max_length=20, choices=TRANSPORT_PREF_CHOICES, default='any',
    )
    accommodation_pref = models.CharField(
        max_length=20, choices=ACCOMMODATION_PREF_CHOICES, default='any',
    )
    food_pref = models.CharField(
        max_length=20, choices=FOOD_PREF_CHOICES, default='any',
    )
    interests = models.JSONField(
        default=list, blank=True,
        help_text='List of travel interests.',
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Budget Profile'
        verbose_name_plural = 'Budget Profiles'

    def __str__(self):
        return f'{self.user.username} - ₹{self.budget_amount} for {self.num_days} days'


class BudgetRecommendation(BaseModel):
    """AI-generated budget recommendation for a destination."""

    profile = models.ForeignKey(
        BudgetProfile, on_delete=models.CASCADE,
        related_name='recommendations',
    )
    destination = models.ForeignKey(
        'destinations.Destination', on_delete=models.CASCADE,
        related_name='budget_recommendations',
    )
    total_estimated_cost = models.DecimalField(
        max_digits=12, decimal_places=2,
    )
    transport_cost = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
    )
    accommodation_cost = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
    )
    food_cost = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
    )
    activities_cost = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
    )
    emergency_reserve = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
    )
    budget_experience_score = models.DecimalField(
        max_digits=4, decimal_places=2, default=0.00,
        help_text='Score indicating how well the destination fits the budget (0-10).',
    )
    reasoning = models.TextField(blank=True)

    class Meta:
        ordering = ['-budget_experience_score']
        verbose_name = 'Budget Recommendation'
        verbose_name_plural = 'Budget Recommendations'

    def __str__(self):
        return f'{self.destination.name} - ₹{self.total_estimated_cost}'


class TripPlan(BaseModel):
    """Interactive Trip Plan created by user or AI."""

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('saved', 'Saved'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='trip_plans', null=True, blank=True,
    )
    session_id = models.CharField(max_length=100, blank=True, help_text='Session ID for unauthenticated travelers.')
    title = models.CharField(max_length=250)
    destination_city = models.CharField(max_length=150)
    departure_city = models.CharField(max_length=150, blank=True)
    state = models.ForeignKey(
        'destinations.State', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='trips',
    )
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    duration_days = models.PositiveIntegerField(default=2)
    budget_amount = models.DecimalField(max_digits=12, decimal_places=2, default=5000.0)
    budget_type = models.CharField(max_length=20, default='per_person')
    traveller_type = models.CharField(max_length=20, default='solo')
    adults_count = models.PositiveIntegerField(default=1)
    children_count = models.PositiveIntegerField(default=0)
    transport_mode = models.CharField(max_length=50, default='bus')
    accommodation_type = models.CharField(max_length=50, default='budget_hotel')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    selected_places = models.JSONField(default=list, blank=True)
    expense_breakdown = models.JSONField(default=dict, blank=True)
    itinerary_data = models.JSONField(default=dict, blank=True)
    ai_suggestions = models.JSONField(default=dict, blank=True)
    is_offline_cached = models.BooleanField(default=False)

    class Meta:
        ordering = ['-updated_at']
        verbose_name = 'Trip Plan'
        verbose_name_plural = 'Trip Plans'

    def __str__(self):
        return f'{self.title} ({self.destination_city} - {self.duration_days} days)'


class TripSelectedDestination(BaseModel):
    """Individual destination selected within a trip plan."""

    trip = models.ForeignKey(
        TripPlan, on_delete=models.CASCADE,
        related_name='destination_items',
    )
    destination = models.ForeignKey(
        'destinations.Destination', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='trip_selections',
    )
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100, blank=True)
    day_number = models.PositiveIntegerField(default=1)
    order_index = models.PositiveIntegerField(default=0)
    allocated_hours = models.DecimalField(max_digits=4, decimal_places=1, default=2.0)
    visiting_time_slot = models.CharField(max_length=50, blank=True)
    notes = models.TextField(blank=True)
    estimated_cost = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)

    class Meta:
        ordering = ['day_number', 'order_index']
        verbose_name = 'Trip Destination Item'
        verbose_name_plural = 'Trip Destination Items'

