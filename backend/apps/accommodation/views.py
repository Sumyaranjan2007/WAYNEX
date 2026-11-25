"""
Views for accommodation app.
"""
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from apps.accommodation.models import AccommodationProvider
from apps.accommodation.serializers import AccommodationProviderSerializer


class AccommodationProviderViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for accommodation providers."""
    queryset = AccommodationProvider.objects.active().select_related('destination')
    serializer_class = AccommodationProviderSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'address', 'destination__name']
    filterset_fields = ['provider_type', 'destination', 'is_verified']
    ordering_fields = ['name', 'rating', 'price_per_night_min']
    ordering = ['name']
