"""
URL configuration for budget app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.budget.views import (
    BudgetProfileViewSet, BudgetRecommendationViewSet, BudgetEstimateView,
    TripPlanViewSet,
)

router = DefaultRouter()
router.register(r'profiles', BudgetProfileViewSet, basename='budget-profile')
router.register(r'recommendations', BudgetRecommendationViewSet, basename='budget-recommendation')
router.register(r'trips', TripPlanViewSet, basename='trip-plan')

app_name = 'budget'

urlpatterns = [
    path('estimate/', BudgetEstimateView.as_view(), name='budget_estimate'),
    path('', include(router.urls)),
]
