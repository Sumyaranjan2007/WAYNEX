"""
URL configuration for social app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.social.views import TravelRoomViewSet, TravelConnectionViewSet

router = DefaultRouter()
router.register(r'rooms', TravelRoomViewSet, basename='travel-room')
router.register(r'connections', TravelConnectionViewSet, basename='travel-connection')

app_name = 'social'

urlpatterns = [
    path('', include(router.urls)),
]
