"""
Serializers for budget app.
"""
from rest_framework import serializers

from apps.budget.models import BudgetProfile, BudgetRecommendation


class BudgetProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetProfile
        fields = [
            'id', 'user', 'starting_location', 'budget_amount',
            'num_days', 'num_travellers', 'travel_type',
            'transport_pref', 'accommodation_pref', 'food_pref',
            'interests', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class BudgetRecommendationSerializer(serializers.ModelSerializer):
    destination_name = serializers.CharField(source='destination.name', read_only=True)

    class Meta:
        model = BudgetRecommendation
        fields = [
            'id', 'profile', 'destination', 'destination_name',
            'total_estimated_cost', 'transport_cost',
            'accommodation_cost', 'food_cost', 'activities_cost',
            'emergency_reserve', 'budget_experience_score',
            'reasoning', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class BudgetEstimateSerializer(serializers.Serializer):
    """Input serializer for budget estimation."""
    starting_location = serializers.CharField(max_length=200)
    destination_id = serializers.UUIDField()
    num_days = serializers.IntegerField(min_value=1, max_value=30)
    num_travellers = serializers.IntegerField(min_value=1, max_value=20)
    travel_type = serializers.ChoiceField(
        choices=BudgetProfile.TRAVEL_TYPE_CHOICES, default='solo',
    )
    transport_pref = serializers.ChoiceField(
        choices=BudgetProfile.TRANSPORT_PREF_CHOICES, default='any',
    )
    accommodation_pref = serializers.ChoiceField(
        choices=BudgetProfile.ACCOMMODATION_PREF_CHOICES, default='any',
    )
    food_pref = serializers.ChoiceField(
        choices=BudgetProfile.FOOD_PREF_CHOICES, default='any',
    )
