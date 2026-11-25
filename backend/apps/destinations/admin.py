"""
Admin configuration for destinations app.
"""
from django.contrib import admin

from apps.destinations.models import (
    State, District, Destination, Attraction, DestinationMedia,
)


@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'code', 'capital', 'is_union_territory', 'is_active',
    ]
    list_filter = ['is_union_territory', 'is_active']
    search_fields = ['name', 'code', 'capital']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ['name', 'state', 'headquarters', 'is_active']
    list_filter = ['state', 'is_active']
    search_fields = ['name', 'headquarters']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']


class AttractionInline(admin.TabularInline):
    model = Attraction
    extra = 0
    fields = ['name', 'category', 'entry_fee', 'opening_hours', 'is_active']


class DestinationMediaInline(admin.TabularInline):
    model = DestinationMedia
    extra = 0
    fields = ['media_type', 'url', 'title', 'is_primary']


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'state', 'category', 'rating', 'review_count',
        'is_hidden_gem', 'is_trending', 'is_active',
    ]
    list_filter = [
        'state', 'category', 'is_hidden_gem', 'is_trending', 'is_active',
    ]
    search_fields = ['name', 'description', 'why_famous']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']
    inlines = [AttractionInline, DestinationMediaInline]
    fieldsets = (
        (None, {
            'fields': (
                'name', 'slug', 'state', 'district', 'category', 'image',
            ),
        }),
        ('Description', {
            'fields': (
                'description', 'history', 'why_famous', 'highlights',
            ),
        }),
        ('Travel Info', {
            'fields': (
                'best_time_to_visit', 'weather_info', 'local_food',
                'culture', 'festivals', 'safety_info', 'accessibility',
                'estimated_budget_per_day',
            ),
        }),
        ('Location', {
            'fields': ('latitude', 'longitude'),
        }),
        ('Status', {
            'fields': (
                'is_hidden_gem', 'is_trending', 'rating', 'review_count',
                'is_active', 'created_at', 'updated_at',
            ),
        }),
    )


@admin.register(Attraction)
class AttractionAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'destination', 'category', 'entry_fee', 'is_active',
    ]
    list_filter = ['category', 'is_active']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(DestinationMedia)
class DestinationMediaAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'destination', 'media_type', 'is_primary', 'is_active',
    ]
    list_filter = ['media_type', 'is_primary', 'is_active']
    search_fields = ['title', 'destination__name']
    readonly_fields = ['created_at', 'updated_at']
