"""
Accommodation models for WAYNEX.
"""
from django.db import models

from core.models import BaseModel


class AccommodationProvider(BaseModel):
    """Accommodation provider (hotel, hostel, homestay, etc.)."""

    PROVIDER_TYPE_CHOICES = [
        ('hotel', 'Hotel'),
        ('hostel', 'Hostel'),
        ('homestay', 'Homestay'),
        ('resort', 'Resort'),
        ('guesthouse', 'Guest House'),
        ('dharamshala', 'Dharamshala'),
        ('camping', 'Camping'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=200)
    provider_type = models.CharField(
        max_length=20, choices=PROVIDER_TYPE_CHOICES, default='hotel',
    )
    destination = models.ForeignKey(
        'destinations.Destination', on_delete=models.CASCADE,
        related_name='accommodations',
    )
    address = models.TextField(blank=True)
    latitude = models.DecimalField(
        max_digits=10, decimal_places=6, null=True, blank=True,
    )
    longitude = models.DecimalField(
        max_digits=10, decimal_places=6, null=True, blank=True,
    )
    price_per_night_min = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text='Minimum price per night in INR.',
    )
    price_per_night_max = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text='Maximum price per night in INR.',
    )
    rating = models.DecimalField(
        max_digits=3, decimal_places=1, default=0.0,
    )
    amenities = models.JSONField(
        default=list, blank=True,
        help_text='List of amenities.',
    )
    booking_url = models.URLField(blank=True)
    is_verified = models.BooleanField(default=False)
    data_source = models.CharField(max_length=200, blank=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Accommodation Provider'
        verbose_name_plural = 'Accommodation Providers'

    def __str__(self):
        return f'{self.name} ({self.get_provider_type_display()}) @ {self.destination.name}'
