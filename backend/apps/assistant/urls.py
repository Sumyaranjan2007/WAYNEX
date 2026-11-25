"""
URLs for AI Assistant app.
"""
from django.urls import path
from apps.assistant.views import AssistantChatView, AssistantRecommendationView

app_name = 'assistant'

urlpatterns = [
    path('chat/', AssistantChatView.as_view(), name='chat'),
    path('recommendations/', AssistantRecommendationView.as_view(), name='recommendations'),
]
