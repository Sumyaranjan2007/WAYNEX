"""
Admin configuration for social app.
"""
from django.contrib import admin

from apps.social.models import TravelRoom, RoomMember, RoomMessage, RoomPoll


class RoomMemberInline(admin.TabularInline):
    model = RoomMember
    extra = 0
    fields = ['user', 'role', 'status', 'joined_at']
    readonly_fields = ['joined_at']


@admin.register(TravelRoom)
class TravelRoomAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'creator', 'destination', 'status', 'visibility',
        'women_only', 'max_members', 'created_at',
    ]
    list_filter = ['status', 'visibility', 'women_only']
    search_fields = ['name', 'description', 'creator__username']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [RoomMemberInline]


@admin.register(RoomMember)
class RoomMemberAdmin(admin.ModelAdmin):
    list_display = ['user', 'room', 'role', 'status', 'joined_at']
    list_filter = ['role', 'status']
    search_fields = ['user__username', 'room__name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(RoomMessage)
class RoomMessageAdmin(admin.ModelAdmin):
    list_display = ['sender', 'room', 'message_type', 'content', 'created_at']
    list_filter = ['message_type']
    search_fields = ['content', 'sender__username', 'room__name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(RoomPoll)
class RoomPollAdmin(admin.ModelAdmin):
    list_display = ['question', 'room', 'is_active_poll', 'created_at']
    list_filter = ['is_active_poll']
    search_fields = ['question', 'room__name']
    readonly_fields = ['created_at', 'updated_at']
