"""
URL configuration for transport app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.transport.views import (
    TransportAgencyViewSet, TransportStopViewSet,
    TransportRouteViewSet, JourneySearchView,
)

router = DefaultRouter()
router.register(r'agencies', TransportAgencyViewSet, basename='agency')
router.register(r'stops', TransportStopViewSet, basename='stop')
router.register(r'routes', TransportRouteViewSet, basename='route')

app_name = 'transport'

urlpatterns = [
    path('journey/', JourneySearchView.as_view(), name='journey_search'),
    path('', include(router.urls)),
]
