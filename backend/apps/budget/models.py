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
