"""
Serializers for transport app.
"""
from rest_framework import serializers

from apps.transport.models import (
    TransportAgency, TransportStop, TransportRoute, RouteStop,
)


class TransportAgencySerializer(serializers.ModelSerializer):
    state_name = serializers.CharField(source='state.name', read_only=True, default=None)

    class Meta:
        model = TransportAgency
        fields = [
            'id', 'name', 'code', 'state', 'state_name',
            'agency_type', 'website', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class TransportStopSerializer(serializers.ModelSerializer):
    agency_name = serializers.CharField(source='agency.name', read_only=True, default=None)

    class Meta:
        model = TransportStop
        fields = [
            'id', 'name', 'code', 'agency', 'agency_name', 'stop_type',
            'latitude', 'longitude', 'city', 'state', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class RouteStopSerializer(serializers.ModelSerializer):
    stop_name = serializers.CharField(source='stop.name', read_only=True)

    class Meta:
        model = RouteStop
        fields = [
            'id', 'stop', 'stop_name', 'stop_order',
            'arrival_offset_minutes',
        ]
        read_only_fields = ['id']


class TransportRouteSerializer(serializers.ModelSerializer):
    agency_name = serializers.CharField(source='agency.name', read_only=True)
    origin_stop_name = serializers.CharField(source='origin_stop.name', read_only=True)
    destination_stop_name = serializers.CharField(source='destination_stop.name', read_only=True)
    stops = RouteStopSerializer(many=True, read_only=True)

    class Meta:
        model = TransportRoute
        fields = [
            'id', 'agency', 'agency_name', 'route_number', 'name',
            'origin_stop', 'origin_stop_name',
            'destination_stop', 'destination_stop_name',
            'route_type', 'distance_km', 'duration_minutes',
            'fare_estimate', 'service_days', 'data_source',
            'is_verified', 'last_verified', 'confidence_score',
            'stops', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class TransportRouteListSerializer(serializers.ModelSerializer):
    agency_name = serializers.CharField(source='agency.name', read_only=True)
    origin_stop_name = serializers.CharField(source='origin_stop.name', read_only=True)
    destination_stop_name = serializers.CharField(source='destination_stop.name', read_only=True)

    class Meta:
        model = TransportRoute
        fields = [
            'id', 'agency_name', 'route_number', 'name',
            'origin_stop_name', 'destination_stop_name',
            'route_type', 'distance_km', 'duration_minutes',
            'fare_estimate', 'is_verified',
        ]


class JourneySearchSerializer(serializers.Serializer):
    """Serializer for journey search input."""
    origin = serializers.CharField(max_length=200)
    destination = serializers.CharField(max_length=200)
    date = serializers.DateField(required=False)
    transport_type = serializers.ChoiceField(
        choices=[('all', 'All'), ('bus', 'Bus'), ('train', 'Train'), ('metro', 'Metro')],
        default='all',
    )
