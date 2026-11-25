"""
Admin configuration for budget app.
"""
from django.contrib import admin

from apps.budget.models import BudgetProfile, BudgetRecommendation


@admin.register(BudgetProfile)
class BudgetProfileAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'starting_location', 'budget_amount', 'num_days',
        'num_travellers', 'travel_type', 'created_at',
    ]
    list_filter = ['travel_type', 'transport_pref', 'accommodation_pref']
    search_fields = ['user__username', 'starting_location']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(BudgetRecommendation)
class BudgetRecommendationAdmin(admin.ModelAdmin):
    list_display = [
        'destination', 'total_estimated_cost', 'budget_experience_score',
        'created_at',
    ]
    list_filter = ['budget_experience_score']
    search_fields = ['destination__name', 'reasoning']
    readonly_fields = ['created_at', 'updated_at']
