"""
URLs for states endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.destinations.views import StateViewSet

router = DefaultRouter()
router.register(r'', StateViewSet, basename='state')

app_name = 'states'

urlpatterns = [
    path('', include(router.urls)),
]
