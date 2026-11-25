"""
Serializers for safety app.
"""
from rest_framework import serializers

from apps.safety.models import (
    TrustedContact, EmergencySession, EmergencyLocation,
    EmergencyNotification, SafetyProfile, TripCheckIn,
)


class TrustedContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrustedContact
        fields = [
            'id', 'user', 'name', 'phone', 'email', 'relationship',
            'is_primary', 'is_verified', 'created_at',
        ]
        read_only_fields = ['id', 'user', 'is_verified', 'created_at']


class EmergencyLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyLocation
        fields = ['id', 'latitude', 'longitude', 'accuracy', 'timestamp']
        read_only_fields = ['id', 'timestamp']


class EmergencyNotificationSerializer(serializers.ModelSerializer):
    contact_name = serializers.CharField(source='contact.name', read_only=True)

    class Meta:
        model = EmergencyNotification
        fields = [
            'id', 'contact', 'contact_name', 'notification_type',
            'status', 'sent_at',
        ]
        read_only_fields = ['id', 'sent_at']


class EmergencySessionSerializer(serializers.ModelSerializer):
    locations = EmergencyLocationSerializer(many=True, read_only=True)
    notifications = EmergencyNotificationSerializer(many=True, read_only=True)

    class Meta:
        model = EmergencySession
        fields = [
            'id', 'user', 'status', 'activation_time', 'resolution_time',
            'latitude', 'longitude', 'location_accuracy', 'notes',
            'locations', 'notifications', 'created_at',
        ]
        read_only_fields = ['id', 'user', 'activation_time', 'created_at']


class EmergencySessionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencySession
        fields = ['id', 'status', 'latitude', 'longitude', 'location_accuracy', 'notes']
        read_only_fields = ['id', 'status']


class SafetyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafetyProfile
        fields = [
            'id', 'user', 'emergency_message', 'auto_share_location',
            'check_in_enabled', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class TripCheckInSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripCheckIn
        fields = [
            'id', 'user', 'trip_name', 'expected_arrival',
            'check_in_interval_minutes', 'last_check_in', 'status',
            'created_at',
        ]
        read_only_fields = ['id', 'user', 'last_check_in', 'created_at']
