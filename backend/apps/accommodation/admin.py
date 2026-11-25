"""
Admin configuration for accommodation app.
"""
from django.contrib import admin

from apps.accommodation.models import AccommodationProvider


@admin.register(AccommodationProvider)
class AccommodationProviderAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'provider_type', 'destination', 'price_per_night_min',
        'price_per_night_max', 'rating', 'is_verified', 'is_active',
    ]
    list_filter = ['provider_type', 'is_verified', 'is_active']
    search_fields = ['name', 'address', 'destination__name']
    readonly_fields = ['created_at', 'updated_at']
