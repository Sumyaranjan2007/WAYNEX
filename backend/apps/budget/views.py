"""
Views for budget app.
"""
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.budget.models import BudgetProfile, BudgetRecommendation
from apps.budget.serializers import (
    BudgetProfileSerializer, BudgetRecommendationSerializer,
    BudgetEstimateSerializer,
)
from apps.budget.services import BudgetEstimationService
from apps.destinations.models import Destination


class BudgetProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for budget profiles."""
    serializer_class = BudgetProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BudgetProfile.objects.filter(
            user=self.request.user, is_active=True,
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BudgetRecommendationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for budget recommendations."""
    serializer_class = BudgetRecommendationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BudgetRecommendation.objects.filter(
            profile__user=self.request.user, is_active=True,
        ).select_related('destination', 'profile')


class BudgetEstimateView(APIView):
    """Estimate budget for a trip."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BudgetEstimateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            destination = Destination.objects.get(
                id=serializer.validated_data['destination_id'],
                is_active=True,
            )
        except Destination.DoesNotExist:
            return Response(
                {'error': 'Destination not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        service = BudgetEstimationService()
        estimate = service.estimate(
            destination=destination,
            num_days=serializer.validated_data['num_days'],
            num_travellers=serializer.validated_data['num_travellers'],
            transport_pref=serializer.validated_data.get('transport_pref', 'any'),
            accommodation_pref=serializer.validated_data.get('accommodation_pref', 'any'),
            food_pref=serializer.validated_data.get('food_pref', 'any'),
        )

        return Response({
            'destination': destination.name,
            'num_days': serializer.validated_data['num_days'],
            'num_travellers': serializer.validated_data['num_travellers'],
            **{k: str(v) for k, v in estimate.items()},
        })
