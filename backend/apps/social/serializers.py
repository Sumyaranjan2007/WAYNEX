"""
Serializers for social app.
"""
from rest_framework import serializers

from apps.social.models import (
    TravelRoom, RoomMember, RoomMessage, RoomPoll,
    RoomJoinRequest, RoomItineraryItem, RoomExpense, RoomMemory, TravelConnection,
)


class RoomMemberSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = RoomMember
        fields = [
            'id', 'room', 'user', 'username', 'role', 'status', 'joined_at',
        ]
        read_only_fields = ['id', 'joined_at']


class RoomMessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = RoomMessage
        fields = [
            'id', 'room', 'sender', 'sender_username', 'message_type',
            'content', 'created_at',
        ]
        read_only_fields = ['id', 'sender', 'created_at']


class RoomPollSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomPoll
        fields = [
            'id', 'room', 'question', 'options', 'votes',
            'is_active_poll', 'created_at',
        ]
        read_only_fields = ['id', 'votes', 'created_at']


class RoomItineraryItemSerializer(serializers.ModelSerializer):
    suggested_by_username = serializers.CharField(source='suggested_by.username', read_only=True)

    class Meta:
        model = RoomItineraryItem
        fields = [
            'id', 'room', 'day_number', 'time_slot', 'title', 'description',
            'category', 'entry_fee', 'votes_count', 'voter_ids', 'is_confirmed',
            'suggested_by', 'suggested_by_username', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class RoomExpenseSerializer(serializers.ModelSerializer):
    paid_by_username = serializers.CharField(source='paid_by.username', read_only=True)

    class Meta:
        model = RoomExpense
        fields = [
            'id', 'room', 'title', 'amount', 'category', 'paid_by',
            'paid_by_username', 'split_among', 'receipt_url', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class RoomMemorySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = RoomMemory
        fields = [
            'id', 'room', 'user', 'username', 'image_url', 'caption',
            'location_name', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class TravelConnectionSerializer(serializers.ModelSerializer):
    from_username = serializers.CharField(source='from_user.username', read_only=True)
    to_username = serializers.CharField(source='to_user.username', read_only=True)

    class Meta:
        model = TravelConnection
        fields = [
            'id', 'from_user', 'from_username', 'to_user', 'to_username',
            'status', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class TravelRoomListSerializer(serializers.ModelSerializer):
    creator_username = serializers.CharField(source='creator.username', read_only=True)
    member_count = serializers.IntegerField(read_only=True)
    destination_name = serializers.CharField(
        source='destination.name', read_only=True, default=None,
    )

    class Meta:
        model = TravelRoom
        fields = [
            'id', 'name', 'description', 'creator', 'creator_username',
            'destination', 'destination_name', 'destination_city', 'state_name',
            'cover_image', 'starting_location', 'travel_dates_start', 'travel_dates_end',
            'duration_days', 'budget_per_person', 'min_budget', 'max_budget',
            'travel_style', 'transport_preference', 'max_members', 'member_count',
            'travel_interests', 'visibility', 'join_approval', 'women_only',
            'live_mode', 'room_rules', 'status', 'created_at',
        ]
        read_only_fields = ['id', 'creator', 'created_at']


class TravelRoomDetailSerializer(serializers.ModelSerializer):
    creator_username = serializers.CharField(source='creator.username', read_only=True)
    members = RoomMemberSerializer(many=True, read_only=True)
    polls = RoomPollSerializer(many=True, read_only=True)
    itinerary_items = RoomItineraryItemSerializer(many=True, read_only=True)
    expenses = RoomExpenseSerializer(many=True, read_only=True)
    memories = RoomMemorySerializer(many=True, read_only=True)
    destination_name = serializers.CharField(
        source='destination.name', read_only=True, default=None,
    )

    class Meta:
        model = TravelRoom
        fields = [
            'id', 'name', 'description', 'creator', 'creator_username',
            'destination', 'destination_name', 'destination_city', 'state_name',
            'cover_image', 'starting_location', 'travel_dates_start', 'travel_dates_end',
            'duration_days', 'budget_per_person', 'min_budget', 'max_budget',
            'travel_style', 'transport_preference', 'max_members', 'travel_interests',
            'visibility', 'join_approval', 'women_only', 'live_mode', 'room_rules',
            'status', 'members', 'polls', 'itinerary_items', 'expenses', 'memories',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'creator', 'created_at', 'updated_at']
