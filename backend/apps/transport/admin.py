"""
Admin configuration for transport app.
"""
from django.contrib import admin

from apps.transport.models import (
    TransportAgency, TransportStop, TransportRoute, RouteStop,
)


class RouteStopInline(admin.TabularInline):
    model = RouteStop
    extra = 0
    fields = ['stop', 'stop_order', 'arrival_offset_minutes']
    ordering = ['stop_order']


@admin.register(TransportAgency)
class TransportAgencyAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'agency_type', 'state', 'is_active']
    list_filter = ['agency_type', 'is_active']
    search_fields = ['name', 'code']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(TransportStop)
class TransportStopAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'stop_type', 'city', 'state', 'is_active']
    list_filter = ['stop_type', 'state', 'is_active']
    search_fields = ['name', 'code', 'city']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(TransportRoute)
class TransportRouteAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'route_number', 'agency', 'route_type',
        'distance_km', 'duration_minutes', 'fare_estimate',
        'is_verified', 'is_active',
    ]
    list_filter = ['route_type', 'agency', 'is_verified', 'is_active']
    search_fields = ['name', 'route_number']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [RouteStopInline]


@admin.register(RouteStop)
class RouteStopAdmin(admin.ModelAdmin):
    list_display = ['route', 'stop', 'stop_order', 'arrival_offset_minutes']
    list_filter = ['route']
    search_fields = ['route__name', 'stop__name']
    readonly_fields = ['created_at', 'updated_at']
