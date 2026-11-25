"""
URLs for AI Assistant app.
"""
from django.urls import path
from apps.assistant.views import (
    AssistantStatusView,
    AssistantChatView,
    AssistantRecommendationView,
    AssistantItineraryView,
    AssistantRoomView,
)

app_name = 'assistant'

urlpatterns = [
    path('status/', AssistantStatusView.as_view(), name='status'),
    path('chat/', AssistantChatView.as_view(), name='chat'),
    path('recommendations/', AssistantRecommendationView.as_view(), name='recommendations'),
    path('itinerary/', AssistantItineraryView.as_view(), name='itinerary'),
    path('room/', AssistantRoomView.as_view(), name='room'),
]
