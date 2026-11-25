"""
Views for AI Assistant app.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from apps.assistant.serializers import (
    ChatMessageSerializer,
    ChatResponseSerializer,
    RecommendationRequestSerializer,
)
from apps.assistant.services import GeminiService


class AssistantChatView(APIView):
    """
    POST /api/v1/assistant/chat/
    Send a message to the WAYNEX AI travel assistant.
    Supports multi-turn conversations through history.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ChatMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        message = serializer.validated_data['message']
        history = serializer.validated_data.get('history', [])

        service = GeminiService()
        result = service.chat(message=message, history=history)

        return Response(result, status=status.HTTP_200_OK)


class AssistantRecommendationView(APIView):
    """
    POST /api/v1/assistant/recommendations/
    Generate tailored travel and itinerary recommendations.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RecommendationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        prompt = serializer.validated_data['prompt']
        context = {
            'budget': serializer.validated_data.get('budget'),
            'num_days': serializer.validated_data.get('num_days'),
            'starting_location': serializer.validated_data.get('starting_location'),
            'destination': serializer.validated_data.get('destination'),
            'travel_type': serializer.validated_data.get('travel_type'),
            'interests': serializer.validated_data.get('interests'),
        }

        service = GeminiService()
        result = service.get_recommendations(prompt=prompt, context=context)

        return Response(result, status=status.HTTP_200_OK)
