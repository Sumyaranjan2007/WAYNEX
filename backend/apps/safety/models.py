"""
Safety models for WAYNEX.
Emergency contacts, sessions, notifications, profiles, and check-ins.
"""
from django.conf import settings
from django.db import models

from core.models import BaseModel


class TrustedContact(BaseModel):
    """Trusted contact for emergency notifications."""

    RELATIONSHIP_CHOICES = [
        ('parent', 'Parent'),
        ('spouse', 'Spouse'),
        ('sibling', 'Sibling'),
        ('friend', 'Friend'),
        ('colleague', 'Colleague'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='trusted_contacts',
    )
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    relationship = models.CharField(
        max_length=20, choices=RELATIONSHIP_CHOICES, default='other',
    )
    is_primary = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    class Meta:
        ordering = ['-is_primary', 'name']
        verbose_name = 'Trusted Contact'
        verbose_name_plural = 'Trusted Contacts'

    def __str__(self):
        return f'{self.name} ({self.relationship}) - {self.user.username}'


class EmergencySession(BaseModel):
    """Active emergency session."""

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('resolved', 'Resolved'),
        ('false_alarm', 'False Alarm'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='emergency_sessions',
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='active',
    )
    activation_time = models.DateTimeField(auto_now_add=True)
    resolution_time = models.DateTimeField(null=True, blank=True)
    latitude = models.DecimalField(
        max_digits=10, decimal_places=6, null=True, blank=True,
    )
    longitude = models.DecimalField(
        max_digits=10, decimal_places=6, null=True, blank=True,
    )
    location_accuracy = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True,
        help_text='Location accuracy in meters.',
    )
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-activation_time']
        verbose_name = 'Emergency Session'
        verbose_name_plural = 'Emergency Sessions'

    def __str__(self):
        return f'Emergency: {self.user.username} - {self.status}'


class EmergencyLocation(BaseModel):
    """Location update during an emergency session."""

    session = models.ForeignKey(
        EmergencySession, on_delete=models.CASCADE,
        related_name='locations',
    )
    latitude = models.DecimalField(max_digits=10, decimal_places=6)
    longitude = models.DecimalField(max_digits=10, decimal_places=6)
    accuracy = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True,
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Emergency Location'
        verbose_name_plural = 'Emergency Locations'

    def __str__(self):
        return f'Location @ {self.timestamp} for session {self.session.id}'


class EmergencyNotification(BaseModel):
    """Notification sent to a trusted contact during an emergency."""

    NOTIFICATION_TYPE_CHOICES = [
        ('sms', 'SMS'),
        ('email', 'Email'),
        ('push', 'Push Notification'),
        ('call', 'Phone Call'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('failed', 'Failed'),
    ]

    session = models.ForeignKey(
        EmergencySession, on_delete=models.CASCADE,
        related_name='notifications',
    )
    contact = models.ForeignKey(
        TrustedContact, on_delete=models.CASCADE,
        related_name='notifications',
    )
    notification_type = models.CharField(
        max_length=10, choices=NOTIFICATION_TYPE_CHOICES, default='sms',
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending',
    )
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-sent_at']
        verbose_name = 'Emergency Notification'
        verbose_name_plural = 'Emergency Notifications'

    def __str__(self):
        return f'{self.notification_type} to {self.contact.name} - {self.status}'


class SafetyProfile(BaseModel):
    """User safety settings."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='safety_profile',
    )
    emergency_message = models.TextField(
        default='I am in an emergency and need help. Please contact authorities.',
        help_text='Custom emergency message sent to contacts.',
    )
    auto_share_location = models.BooleanField(
        default=True,
        help_text='Automatically share location during emergencies.',
    )
    check_in_enabled = models.BooleanField(
        default=False,
        help_text='Enable periodic check-in reminders.',
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Safety Profile'
        verbose_name_plural = 'Safety Profiles'

    def __str__(self):
        return f'Safety Profile: {self.user.username}'


class TripCheckIn(BaseModel):
    """Periodic check-in during a trip."""

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('checked_in', 'Checked In'),
        ('missed', 'Missed'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='trip_checkins',
    )
    trip_name = models.CharField(max_length=200)
    expected_arrival = models.DateTimeField()
    check_in_interval_minutes = models.PositiveIntegerField(default=60)
    last_check_in = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='active',
    )

    class Meta:
        ordering = ['-expected_arrival']
        verbose_name = 'Trip Check-In'
        verbose_name_plural = 'Trip Check-Ins'

    def __str__(self):
        return f'{self.trip_name} - {self.user.username} ({self.status})'
