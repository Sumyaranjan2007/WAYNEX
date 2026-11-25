"""
Views for transport app.
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from apps.transport.models import (
    TransportAgency, TransportStop, TransportRoute,
)
from apps.transport.serializers import (
    TransportAgencySerializer, TransportStopSerializer,
    TransportRouteSerializer, TransportRouteListSerializer,
    JourneySearchSerializer,
)


class TransportAgencyViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for transport agencies."""
    queryset = TransportAgency.objects.active()
    serializer_class = TransportAgencySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'code']
    filterset_fields = ['agency_type', 'state']


class TransportStopViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for transport stops."""
    queryset = TransportStop.objects.active().select_related('agency', 'state')
    serializer_class = TransportStopSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'code', 'city']
    filterset_fields = ['stop_type', 'city', 'state']


class TransportRouteViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for transport routes."""
    queryset = TransportRoute.objects.active().select_related(
        'agency', 'origin_stop', 'destination_stop',
    ).prefetch_related('stops__stop')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'route_number']
    filterset_fields = ['route_type', 'agency', 'is_verified']

    def get_serializer_class(self):
        if self.action == 'list':
            return TransportRouteListSerializer
        return TransportRouteSerializer


class JourneySearchView(APIView):
    """Search for transport routes between two locations."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = JourneySearchSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        origin = serializer.validated_data['origin']
        destination = serializer.validated_data['destination']
        transport_type = serializer.validated_data.get('transport_type', 'all')

        routes = TransportRoute.objects.active().select_related(
            'agency', 'origin_stop', 'destination_stop',
        ).filter(
            origin_stop__name__icontains=origin,
            destination_stop__name__icontains=destination,
        )

        if transport_type != 'all':
            routes = routes.filter(agency__agency_type=transport_type)

        route_serializer = TransportRouteListSerializer(routes, many=True)
        return Response({
            'origin': origin,
            'destination': destination,
            'routes': route_serializer.data,
            'count': routes.count(),
        })
