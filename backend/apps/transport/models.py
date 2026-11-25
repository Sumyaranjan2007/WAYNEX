"""
Transport models for WAYNEX.
Transport agencies, stops, routes, and route stops.
"""
from django.db import models

from core.models import BaseModel


class TransportAgency(BaseModel):
    """Transport agency (e.g., KSRTC, Indian Railways)."""

    AGENCY_TYPE_CHOICES = [
        ('bus', 'Bus'),
        ('train', 'Train'),
        ('metro', 'Metro'),
        ('ferry', 'Ferry'),
        ('air', 'Air'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    state = models.ForeignKey(
        'destinations.State', on_delete=models.CASCADE,
        related_name='transport_agencies', null=True, blank=True,
    )
    agency_type = models.CharField(
        max_length=20, choices=AGENCY_TYPE_CHOICES, default='bus',
    )
    website = models.URLField(blank=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Transport Agency'
        verbose_name_plural = 'Transport Agencies'

    def __str__(self):
        return f'{self.name} ({self.code})'


class TransportStop(BaseModel):
    """Transport stop (bus stop, railway station, metro station)."""

    STOP_TYPE_CHOICES = [
        ('bus_stop', 'Bus Stop'),
        ('railway_station', 'Railway Station'),
        ('metro', 'Metro Station'),
        ('airport', 'Airport'),
        ('ferry_terminal', 'Ferry Terminal'),
    ]

    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, blank=True)
    agency = models.ForeignKey(
        TransportAgency, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='stops',
    )
    stop_type = models.CharField(
        max_length=20, choices=STOP_TYPE_CHOICES, default='bus_stop',
    )
    latitude = models.DecimalField(
        max_digits=10, decimal_places=6, null=True, blank=True,
    )
    longitude = models.DecimalField(
        max_digits=10, decimal_places=6, null=True, blank=True,
    )
    city = models.CharField(max_length=100, blank=True)
    state = models.ForeignKey(
        'destinations.State', on_delete=models.CASCADE,
        related_name='transport_stops', null=True, blank=True,
    )

    class Meta:
        ordering = ['name']
        verbose_name = 'Transport Stop'
        verbose_name_plural = 'Transport Stops'

    def __str__(self):
        return f'{self.name} ({self.get_stop_type_display()})'


class TransportRoute(BaseModel):
    """Transport route between two stops."""

    ROUTE_TYPE_CHOICES = [
        ('ordinary', 'Ordinary'),
        ('express', 'Express'),
        ('superfast', 'Superfast'),
        ('volvo', 'Volvo AC'),
        ('sleeper', 'Sleeper'),
        ('rajdhani', 'Rajdhani'),
        ('shatabdi', 'Shatabdi'),
        ('local', 'Local'),
        ('metro', 'Metro'),
        ('other', 'Other'),
    ]

    agency = models.ForeignKey(
        TransportAgency, on_delete=models.CASCADE,
        related_name='routes',
    )
    route_number = models.CharField(max_length=50, blank=True)
    name = models.CharField(max_length=200)
    origin_stop = models.ForeignKey(
        TransportStop, on_delete=models.CASCADE,
        related_name='origin_routes',
    )
    destination_stop = models.ForeignKey(
        TransportStop, on_delete=models.CASCADE,
        related_name='destination_routes',
    )
    route_type = models.CharField(
        max_length=20, choices=ROUTE_TYPE_CHOICES, default='ordinary',
    )
    distance_km = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True,
    )
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    fare_estimate = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text='Estimated fare in INR.',
    )
    service_days = models.JSONField(
        default=list, blank=True,
        help_text='Days of the week this route operates.',
    )
    data_source = models.CharField(max_length=200, blank=True)
    is_verified = models.BooleanField(default=False)
    last_verified = models.DateTimeField(null=True, blank=True)
    confidence_score = models.DecimalField(
        max_digits=3, decimal_places=2, default=0.50,
        help_text='Confidence score for data accuracy (0-1).',
    )

    class Meta:
        ordering = ['name']
        verbose_name = 'Transport Route'
        verbose_name_plural = 'Transport Routes'

    def __str__(self):
        return f'{self.name} ({self.origin_stop} → {self.destination_stop})'


class RouteStop(BaseModel):
    """Intermediate stop on a route."""

    route = models.ForeignKey(
        TransportRoute, on_delete=models.CASCADE, related_name='stops',
    )
    stop = models.ForeignKey(
        TransportStop, on_delete=models.CASCADE, related_name='route_stops',
    )
    stop_order = models.PositiveIntegerField()
    arrival_offset_minutes = models.PositiveIntegerField(
        default=0,
        help_text='Minutes from origin departure.',
    )

    class Meta:
        ordering = ['route', 'stop_order']
        unique_together = ['route', 'stop_order']
        verbose_name = 'Route Stop'
        verbose_name_plural = 'Route Stops'

    def __str__(self):
        return f'{self.route.name} - Stop #{self.stop_order}: {self.stop.name}'
