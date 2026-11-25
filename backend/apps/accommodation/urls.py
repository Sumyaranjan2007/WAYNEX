"""
URL configuration for accommodation app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.accommodation.views import AccommodationProviderViewSet

router = DefaultRouter()
router.register(r'', AccommodationProviderViewSet, basename='accommodation')

app_name = 'accommodation'

urlpatterns = [
    path('', include(router.urls)),
]
