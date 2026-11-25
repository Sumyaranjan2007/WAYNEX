"""
URL configuration for social app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.social.views import TravelRoomViewSet

router = DefaultRouter()
router.register(r'rooms', TravelRoomViewSet, basename='travel-room')

app_name = 'social'

urlpatterns = [
    path('', include(router.urls)),
]
