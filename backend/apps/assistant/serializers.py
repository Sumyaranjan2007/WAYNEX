"""
Serializers for AI Assistant app.
"""
from rest_framework import serializers


class ChatMessageSerializer(serializers.Serializer):
    """Input serializer for sending a chat message to the assistant."""
    message = serializers.CharField(max_length=2000, required=True)
    history = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        default=list,
    )


class ChatResponseSerializer(serializers.Serializer):
    """Output serializer for chat assistant response."""
    success = serializers.BooleanField()
    response = serializers.CharField()
    mode = serializers.CharField()
    api_configured = serializers.BooleanField(required=False)
    note = serializers.CharField(required=False)


class RecommendationRequestSerializer(serializers.Serializer):
    """Input serializer for itinerary and travel recommendations."""
    prompt = serializers.CharField(max_length=2000, required=True)
    budget = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    num_days = serializers.IntegerField(min_value=1, max_value=60, required=False)
    starting_location = serializers.CharField(max_length=200, required=False)
    destination = serializers.CharField(max_length=200, required=False)
    travel_type = serializers.CharField(max_length=50, required=False)
    interests = serializers.ListField(child=serializers.CharField(), required=False, default=list)
