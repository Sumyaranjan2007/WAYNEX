"""
Serializers for social app.
"""
from rest_framework import serializers

from apps.social.models import TravelRoom, RoomMember, RoomMessage, RoomPoll


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
            'destination', 'destination_name', 'starting_location',
            'travel_dates_start', 'travel_dates_end', 'budget_per_person',
            'max_members', 'member_count', 'visibility', 'women_only',
            'status', 'created_at',
        ]
        read_only_fields = ['id', 'creator', 'created_at']


class TravelRoomDetailSerializer(serializers.ModelSerializer):
    creator_username = serializers.CharField(source='creator.username', read_only=True)
    members = RoomMemberSerializer(many=True, read_only=True)
    polls = RoomPollSerializer(many=True, read_only=True)
    destination_name = serializers.CharField(
        source='destination.name', read_only=True, default=None,
    )

    class Meta:
        model = TravelRoom
        fields = [
            'id', 'name', 'description', 'creator', 'creator_username',
            'destination', 'destination_name', 'starting_location',
            'travel_dates_start', 'travel_dates_end', 'budget_per_person',
            'max_members', 'travel_interests', 'visibility',
            'join_approval', 'women_only', 'status',
            'members', 'polls', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'creator', 'created_at', 'updated_at']
