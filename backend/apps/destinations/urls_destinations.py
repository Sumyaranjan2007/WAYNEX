"""
URLs for destinations endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.destinations.views import DestinationViewSet

router = DefaultRouter()
router.register(r'', DestinationViewSet, basename='destination')

app_name = 'destinations'

urlpatterns = [
    path('', include(router.urls)),
]
