"""
Admin configuration for safety app.
"""
from django.contrib import admin

from apps.safety.models import (
    TrustedContact, EmergencySession, EmergencyLocation,
    EmergencyNotification, SafetyProfile, TripCheckIn,
)


@admin.register(TrustedContact)
class TrustedContactAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'user', 'phone', 'relationship', 'is_primary', 'is_verified',
    ]
    list_filter = ['relationship', 'is_primary', 'is_verified']
    search_fields = ['name', 'phone', 'user__username']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(EmergencySession)
class EmergencySessionAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'status', 'activation_time', 'resolution_time',
        'latitude', 'longitude',
    ]
    list_filter = ['status']
    search_fields = ['user__username', 'notes']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(EmergencyLocation)
class EmergencyLocationAdmin(admin.ModelAdmin):
    list_display = ['session', 'latitude', 'longitude', 'accuracy', 'timestamp']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(EmergencyNotification)
class EmergencyNotificationAdmin(admin.ModelAdmin):
    list_display = [
        'session', 'contact', 'notification_type', 'status', 'sent_at',
    ]
    list_filter = ['notification_type', 'status']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(SafetyProfile)
class SafetyProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'auto_share_location', 'check_in_enabled']
    search_fields = ['user__username']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(TripCheckIn)
class TripCheckInAdmin(admin.ModelAdmin):
    list_display = [
        'trip_name', 'user', 'expected_arrival', 'last_check_in', 'status',
    ]
    list_filter = ['status']
    search_fields = ['trip_name', 'user__username']
    readonly_fields = ['created_at', 'updated_at']
