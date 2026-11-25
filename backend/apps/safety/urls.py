"""
URL configuration for safety app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.safety.views import (
    TrustedContactViewSet, EmergencySessionViewSet,
    SafetyProfileViewSet, TripCheckInViewSet,
)

router = DefaultRouter()
router.register(r'contacts', TrustedContactViewSet, basename='trusted-contact')
router.register(r'sessions', EmergencySessionViewSet, basename='emergency-session')
router.register(r'profile', SafetyProfileViewSet, basename='safety-profile')
router.register(r'checkins', TripCheckInViewSet, basename='trip-checkin')

app_name = 'safety'

urlpatterns = [
    path('', include(router.urls)),
]
