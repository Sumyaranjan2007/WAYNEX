"""
URL configuration for languages app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.languages.views import LanguageViewSet, TravelPhraseViewSet, TranslateView

router = DefaultRouter()
router.register(r'list', LanguageViewSet, basename='language')
router.register(r'phrases', TravelPhraseViewSet, basename='travel-phrase')

app_name = 'languages'

urlpatterns = [
    path('translate/', TranslateView.as_view(), name='translate'),
    path('', include(router.urls)),
]
