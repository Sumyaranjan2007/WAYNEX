"""
Destination models for WAYNEX.
States, Districts, Destinations, Attractions, and Media.
"""
from django.db import models
from django.utils.text import slugify

from core.models import BaseModel


class State(BaseModel):
    """Indian state or union territory."""

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    code = models.CharField(
        max_length=5, unique=True,
        help_text='State code (e.g., KA for Karnataka).',
    )
    capital = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    history = models.TextField(blank=True)
    geography = models.TextField(blank=True)
    climate = models.TextField(blank=True)
    best_time_to_visit = models.CharField(max_length=255, blank=True)
    languages = models.CharField(
        max_length=255, blank=True,
        help_text='Comma-separated list of languages spoken.',
    )
    image = models.ImageField(upload_to='states/', blank=True, null=True)
    latitude = models.DecimalField(
        max_digits=10, decimal_places=6, null=True, blank=True,
    )
    longitude = models.DecimalField(
        max_digits=10, decimal_places=6, null=True, blank=True,
    )
    is_union_territory = models.BooleanField(default=False)
    formation_date = models.CharField(max_length=50, blank=True)
    area_sq_km = models.PositiveIntegerField(null=True, blank=True, help_text='Total area in sq km')
    districts_count = models.PositiveIntegerField(default=0)
    official_website = models.URLField(max_length=300, blank=True)
    tourism_website = models.URLField(max_length=300, blank=True)
    monthly_climate = models.JSONField(
        default=dict, blank=True,
        help_text='Month-by-month temperature, rainfall, and travel conditions'
    )
    historical_timeline = models.JSONField(
        default=list, blank=True,
        help_text='Chronological timeline events'
    )
    cultural_heritage = models.JSONField(
        default=dict, blank=True,
        help_text='Traditional arts, dances, festivals, and cuisine'
    )
    travel_transport = models.JSONField(
        default=dict, blank=True,
        help_text='Airports, major rail hubs, and regional bus connectivity'
    )
    emergency_contacts = models.JSONField(
        default=dict, blank=True,
        help_text='State tourist helpline and emergency contacts'
    )

    class Meta:
        ordering = ['name']
        verbose_name = 'State'
        verbose_name_plural = 'States'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class District(BaseModel):
    """District within a state."""

    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, blank=True)
    state = models.ForeignKey(
        State, on_delete=models.CASCADE, related_name='districts',
    )
    description = models.TextField(blank=True)
    headquarters = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ['name']
        unique_together = ['name', 'state']
        verbose_name = 'District'
        verbose_name_plural = 'Districts'

    def __str__(self):
        return f'{self.name}, {self.state.name}'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Destination(BaseModel):
    """Travel destination."""

    CATEGORY_CHOICES = [
        ('city', 'City'),
        ('hill_station', 'Hill Station'),
        ('beach', 'Beach'),
        ('waterfall', 'Waterfall'),
        ('temple', 'Temple'),
        ('monument', 'Monument'),
        ('national_park', 'National Park'),
        ('village', 'Village'),
        ('heritage_site', 'Heritage Site'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    state = models.ForeignKey(
        State, on_delete=models.CASCADE, related_name='destinations',
    )
    district = models.ForeignKey(
        District, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='destinations',
    )
    category = models.CharField(
        max_length=30, choices=CATEGORY_CHOICES, default='other',
    )
    description = models.TextField(blank=True)
    history = models.TextField(blank=True)
    why_famous = models.TextField(blank=True)
    highlights = models.JSONField(
        default=list, blank=True,
        help_text='List of key highlights.',
    )
    best_time_to_visit = models.CharField(max_length=255, blank=True)
    weather_info = models.TextField(blank=True)
    local_food = models.JSONField(
        default=list, blank=True,
        help_text='List of local food specialties.',
    )
    culture = models.TextField(blank=True)
    festivals = models.JSONField(
        default=list, blank=True,
        help_text='List of festivals celebrated.',
    )
    safety_info = models.TextField(blank=True)
    accessibility = models.TextField(blank=True)
    estimated_budget_per_day = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text='Estimated budget per day in INR.',
    )
    latitude = models.DecimalField(
        max_digits=10, decimal_places=6, null=True, blank=True,
    )
    longitude = models.DecimalField(
        max_digits=10, decimal_places=6, null=True, blank=True,
    )
    is_hidden_gem = models.BooleanField(default=False)
    is_trending = models.BooleanField(default=False)
    rating = models.DecimalField(
        max_digits=3, decimal_places=1, default=0.0,
    )
    review_count = models.PositiveIntegerField(default=0)
    image = models.ImageField(
        upload_to='destinations/', blank=True, null=True,
    )

    class Meta:
        ordering = ['name']
        verbose_name = 'Destination'
        verbose_name_plural = 'Destinations'

    def __str__(self):
        return f'{self.name} ({self.state.name})'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Attraction(BaseModel):
    """Point of interest within a destination."""

    CATEGORY_CHOICES = [
        ('historical', 'Historical'),
        ('natural', 'Natural'),
        ('religious', 'Religious'),
        ('adventure', 'Adventure'),
        ('cultural', 'Cultural'),
        ('entertainment', 'Entertainment'),
        ('shopping', 'Shopping'),
        ('food', 'Food'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=200)
    destination = models.ForeignKey(
        Destination, on_delete=models.CASCADE, related_name='attractions',
    )
    category = models.CharField(
        max_length=30, choices=CATEGORY_CHOICES, default='other',
    )
    description = models.TextField(blank=True)
    entry_fee = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text='Entry fee in INR.',
    )
    opening_hours = models.CharField(max_length=255, blank=True)
    visit_duration = models.CharField(
        max_length=100, blank=True,
        help_text='Recommended visit duration (e.g., "2-3 hours").',
    )
    latitude = models.DecimalField(
        max_digits=10, decimal_places=6, null=True, blank=True,
    )
    longitude = models.DecimalField(
        max_digits=10, decimal_places=6, null=True, blank=True,
    )

    class Meta:
        ordering = ['name']
        verbose_name = 'Attraction'
        verbose_name_plural = 'Attractions'

    def __str__(self):
        return f'{self.name} @ {self.destination.name}'


class DestinationMedia(BaseModel):
    """Media assets for destinations."""

    MEDIA_TYPE_CHOICES = [
        ('image', 'Image'),
        ('video', 'Video'),
        ('youtube', 'YouTube'),
    ]

    destination = models.ForeignKey(
        Destination, on_delete=models.CASCADE, related_name='media',
    )
    media_type = models.CharField(
        max_length=10, choices=MEDIA_TYPE_CHOICES, default='image',
    )
    url = models.URLField(max_length=500)
    title = models.CharField(max_length=200, blank=True)
    source = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)

    class Meta:
        ordering = ['-is_primary', '-created_at']
        verbose_name = 'Destination Media'
        verbose_name_plural = 'Destination Media'

    def __str__(self):
        return f'{self.media_type}: {self.title or self.destination.name}'
