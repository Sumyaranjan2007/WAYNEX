"""
URLs for districts endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.destinations.views import DistrictViewSet

router = DefaultRouter()
router.register(r'', DistrictViewSet, basename='district')

app_name = 'districts'

urlpatterns = [
    path('', include(router.urls)),
]
