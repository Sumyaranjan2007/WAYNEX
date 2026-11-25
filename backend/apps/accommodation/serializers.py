"""
Serializers for accommodation app.
"""
from rest_framework import serializers

from apps.accommodation.models import AccommodationProvider


class AccommodationProviderSerializer(serializers.ModelSerializer):
    destination_name = serializers.CharField(source='destination.name', read_only=True)

    class Meta:
        model = AccommodationProvider
        fields = [
            'id', 'name', 'provider_type', 'destination', 'destination_name',
            'address', 'latitude', 'longitude',
            'price_per_night_min', 'price_per_night_max',
            'rating', 'amenities', 'booking_url',
            'is_verified', 'data_source', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']
