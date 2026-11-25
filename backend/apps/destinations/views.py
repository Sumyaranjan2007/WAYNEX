"""
Views for destinations app.
"""
from django.db import models
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.destinations.models import (
    State, District, Destination, Attraction, DestinationMedia,
)
from apps.destinations.serializers import (
    StateSerializer, StateListSerializer,
    DistrictSerializer,
    DestinationListSerializer, DestinationDetailSerializer,
    AttractionSerializer, DestinationMediaSerializer,
)
from apps.destinations.filters import DestinationFilter, StateFilter, DistrictFilter


class StateViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Indian states and union territories."""
    queryset = State.objects.active()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = StateFilter
    search_fields = ['name', 'capital', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return StateListSerializer
        return StateSerializer

    @action(detail=True, methods=['get'])
    def destinations(self, request, slug=None):
        """List all destinations in a state."""
        state = self.get_object()
        destinations = Destination.objects.filter(state=state, is_active=True)
        serializer = DestinationListSerializer(destinations, many=True)
        return Response(serializer.data)


class DistrictViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for districts."""
    queryset = District.objects.active().select_related('state')
    serializer_class = DistrictSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = DistrictFilter
    search_fields = ['name', 'headquarters']
    lookup_field = 'slug'


class DestinationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for destinations."""
    queryset = Destination.objects.active().select_related('state', 'district')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = DestinationFilter
    search_fields = ['name', 'description', 'why_famous', 'category']
    ordering_fields = ['name', 'rating', 'review_count', 'estimated_budget_per_day', 'created_at']
    ordering = ['name']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return DestinationDetailSerializer
        return DestinationListSerializer

    @action(detail=True, methods=['get'])
    def attractions(self, request, slug=None):
        """List attractions for a destination."""
        destination = self.get_object()
        attractions = Attraction.objects.filter(
            destination=destination, is_active=True,
        )
        serializer = AttractionSerializer(attractions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def media(self, request, slug=None):
        """List media for a destination."""
        destination = self.get_object()
        media = DestinationMedia.objects.filter(
            destination=destination, is_active=True,
        )
        serializer = DestinationMediaSerializer(media, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def trending(self, request):
        """List trending destinations."""
        trending = self.get_queryset().filter(is_trending=True)
        serializer = DestinationListSerializer(trending, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def hidden_gems(self, request):
        """List hidden gem destinations."""
        gems = self.get_queryset().filter(is_hidden_gem=True)
        serializer = DestinationListSerializer(gems, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search destinations by query parameter."""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'results': []})
        destinations = self.get_queryset().filter(
            models.Q(name__icontains=query)
            | models.Q(description__icontains=query)
            | models.Q(why_famous__icontains=query)
            | models.Q(state__name__icontains=query)
        )
        serializer = DestinationListSerializer(destinations, many=True)
        return Response({'results': serializer.data})
