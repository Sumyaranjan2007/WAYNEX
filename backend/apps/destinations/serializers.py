"""
Serializers for destinations app.
"""
from rest_framework import serializers

from apps.destinations.models import (
    State, District, Destination, Attraction, DestinationMedia,
)


class StateSerializer(serializers.ModelSerializer):
    """Serializer for State model."""
    destination_count = serializers.SerializerMethodField()

    class Meta:
        model = State
        fields = [
            'id', 'name', 'slug', 'code', 'capital', 'description',
            'history', 'geography', 'climate', 'best_time_to_visit',
            'languages', 'image', 'latitude', 'longitude',
            'is_union_territory', 'destination_count', 'created_at',
        ]
        read_only_fields = ['id', 'slug', 'created_at']

    def get_destination_count(self, obj):
        return obj.destinations.count()


class StateListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for state listings."""

    class Meta:
        model = State
        fields = [
            'id', 'name', 'slug', 'code', 'capital',
            'is_union_territory', 'image',
        ]


class DistrictSerializer(serializers.ModelSerializer):
    """Serializer for District model."""
    state_name = serializers.CharField(source='state.name', read_only=True)

    class Meta:
        model = District
        fields = [
            'id', 'name', 'slug', 'state', 'state_name',
            'description', 'headquarters', 'created_at',
        ]
        read_only_fields = ['id', 'slug', 'created_at']


class AttractionSerializer(serializers.ModelSerializer):
    """Serializer for Attraction model."""

    class Meta:
        model = Attraction
        fields = [
            'id', 'name', 'destination', 'category', 'description',
            'entry_fee', 'opening_hours', 'visit_duration',
            'latitude', 'longitude', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class DestinationMediaSerializer(serializers.ModelSerializer):
    """Serializer for DestinationMedia model."""

    class Meta:
        model = DestinationMedia
        fields = [
            'id', 'destination', 'media_type', 'url', 'title',
            'source', 'is_primary', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class DestinationListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for destination listings."""
    state_name = serializers.CharField(source='state.name', read_only=True)

    class Meta:
        model = Destination
        fields = [
            'id', 'name', 'slug', 'state', 'state_name', 'category',
            'description', 'latitude', 'longitude', 'is_hidden_gem',
            'is_trending', 'rating', 'review_count', 'image',
            'best_time_to_visit', 'estimated_budget_per_day',
        ]


class DestinationDetailSerializer(serializers.ModelSerializer):
    """Full serializer for destination detail view."""
    state_name = serializers.CharField(source='state.name', read_only=True)
    district_name = serializers.CharField(
        source='district.name', read_only=True, default=None,
    )
    attractions = AttractionSerializer(many=True, read_only=True)
    media = DestinationMediaSerializer(many=True, read_only=True)

    class Meta:
        model = Destination
        fields = [
            'id', 'name', 'slug', 'state', 'state_name',
            'district', 'district_name', 'category', 'description',
            'history', 'why_famous', 'highlights', 'best_time_to_visit',
            'weather_info', 'local_food', 'culture', 'festivals',
            'safety_info', 'accessibility', 'estimated_budget_per_day',
            'latitude', 'longitude', 'is_hidden_gem', 'is_trending',
            'rating', 'review_count', 'image', 'attractions', 'media',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
