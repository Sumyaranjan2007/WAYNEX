"""
Views for safety app.
"""
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.safety.models import (
    TrustedContact, EmergencySession, SafetyProfile, TripCheckIn,
)
from apps.safety.serializers import (
    TrustedContactSerializer, EmergencySessionSerializer,
    EmergencySessionCreateSerializer, SafetyProfileSerializer,
    TripCheckInSerializer,
)


class TrustedContactViewSet(viewsets.ModelViewSet):
    """ViewSet for trusted contacts."""
    serializer_class = TrustedContactSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TrustedContact.objects.filter(
            user=self.request.user, is_active=True,
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class EmergencySessionViewSet(viewsets.ModelViewSet):
    """ViewSet for emergency sessions."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EmergencySession.objects.filter(
            user=self.request.user,
        ).prefetch_related('locations', 'notifications')

    def get_serializer_class(self):
        if self.action == 'create':
            return EmergencySessionCreateSerializer
        return EmergencySessionSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Resolve an emergency session."""
        session = self.get_object()
        session.status = 'resolved'
        session.resolution_time = timezone.now()
        session.save(update_fields=['status', 'resolution_time', 'updated_at'])
        return Response(EmergencySessionSerializer(session).data)

    @action(detail=True, methods=['post'])
    def false_alarm(self, request, pk=None):
        """Mark session as false alarm."""
        session = self.get_object()
        session.status = 'false_alarm'
        session.resolution_time = timezone.now()
        session.save(update_fields=['status', 'resolution_time', 'updated_at'])
        return Response(EmergencySessionSerializer(session).data)


class SafetyProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for safety profile."""
    serializer_class = SafetyProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SafetyProfile.objects.filter(user=self.request.user)

    def get_object(self):
        profile, _ = SafetyProfile.objects.get_or_create(
            user=self.request.user,
        )
        return profile

    def list(self, request, *args, **kwargs):
        profile = self.get_object()
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TripCheckInViewSet(viewsets.ModelViewSet):
    """ViewSet for trip check-ins."""
    serializer_class = TripCheckInSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TripCheckIn.objects.filter(
            user=self.request.user, is_active=True,
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def check_in(self, request, pk=None):
        """Record a check-in."""
        trip = self.get_object()
        trip.last_check_in = timezone.now()
        trip.status = 'checked_in'
        trip.save(update_fields=['last_check_in', 'status', 'updated_at'])
        return Response(TripCheckInSerializer(trip).data)
