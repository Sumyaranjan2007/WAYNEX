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


class AssistantStatusView(APIView):
    """
    GET /api/v1/assistant/status/
    Test live Google Gemini API connectivity.
    Never exposes raw API keys to clients.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        service = GeminiService()
        result = service.test_connection()
        return Response(result, status=status.HTTP_200_OK)


class AssistantChatView(APIView):
    """
    POST /api/v1/assistant/chat/
    Send a message to the WAYNEX AI travel assistant.
    Supports multi-turn conversations through history.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        message = request.data.get('message', '').strip()
        history = request.data.get('history', [])

        if not message:
            return Response(
                {'error': 'Field "message" is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

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
        prompt = request.data.get('prompt', '').strip()
        if not prompt:
            return Response(
                {'error': 'Field "prompt" is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        context = {
            'budget': request.data.get('budget'),
            'num_days': request.data.get('num_days'),
            'starting_location': request.data.get('starting_location'),
            'destination': request.data.get('destination'),
            'travel_type': request.data.get('travel_type'),
            'interests': request.data.get('interests'),
        }

        service = GeminiService()
        result = service.get_recommendations(prompt=prompt, context=context)
        return Response(result, status=status.HTTP_200_OK)


class AssistantItineraryView(APIView):
    """
    POST /api/v1/assistant/itinerary/
    Generate an AI-powered day-by-day itinerary.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        destination = request.data.get('destination', 'Karnataka')
        num_days = int(request.data.get('num_days', 3))
        budget = request.data.get('budget')
        if budget is not None:
            budget = float(budget)
        travel_style = request.data.get('travel_style', 'balanced')
        attractions = request.data.get('attractions', [])
        departure_city = request.data.get('departure_city', 'Bengaluru')

        service = GeminiService()
        result = service.generate_itinerary(
            destination=destination,
            num_days=num_days,
            budget=budget,
            travel_style=travel_style,
            attractions=attractions,
            departure_city=departure_city,
        )
        return Response(result, status=status.HTTP_200_OK)


class AssistantRoomView(APIView):
    """
    POST /api/v1/assistant/room/
    Context-aware travel answers for WAYNEX Connect group rooms.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        room_name = request.data.get('room_name', 'Group Trip')
        destination = request.data.get('destination', 'India')
        message = request.data.get('message', '').strip()
        group_context = request.data.get('group_context', {})

        if not message:
            return Response(
                {'error': 'Field "message" is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        service = GeminiService()
        result = service.room_assistant(
            room_name=room_name,
            destination=destination,
            user_query=message,
            group_context=group_context,
        )
        return Response(result, status=status.HTTP_200_OK)
