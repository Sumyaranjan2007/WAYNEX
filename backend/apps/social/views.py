"""
Views for social app.
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.social.models import TravelRoom, RoomMember, RoomMessage, RoomPoll
from apps.social.serializers import (
    TravelRoomListSerializer, TravelRoomDetailSerializer,
    RoomMemberSerializer, RoomMessageSerializer, RoomPollSerializer,
)


class TravelRoomViewSet(viewsets.ModelViewSet):
    """ViewSet for travel rooms."""
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    filterset_fields = ['visibility', 'status', 'women_only', 'destination']
    ordering_fields = ['created_at', 'travel_dates_start']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = TravelRoom.objects.active().select_related('creator', 'destination')
        if self.action == 'list':
            # Show public rooms + user's rooms
            if self.request.user.is_authenticated:
                from django.db.models import Q
                return qs.filter(
                    Q(visibility='public')
                    | Q(creator=self.request.user)
                    | Q(members__user=self.request.user),
                ).distinct()
            return qs.filter(visibility='public')
        return qs

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TravelRoomDetailSerializer
        return TravelRoomListSerializer

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAuthenticated()]
        return super().get_permissions()

    def perform_create(self, serializer):
        room = serializer.save(creator=self.request.user)
        # Creator is automatically an admin member
        RoomMember.objects.create(
            room=room, user=self.request.user,
            role='admin', status='approved',
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        """Join a travel room."""
        room = self.get_object()
        if room.member_count >= room.max_members:
            return Response(
                {'error': 'Room is full.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        member, created = RoomMember.objects.get_or_create(
            room=room, user=request.user,
            defaults={
                'status': 'approved' if room.join_approval == 'auto' else 'pending',
            },
        )
        if not created:
            return Response(
                {'error': 'You are already a member of this room.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            RoomMemberSerializer(member).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def leave(self, request, pk=None):
        """Leave a travel room."""
        room = self.get_object()
        try:
            member = RoomMember.objects.get(room=room, user=request.user)
            member.status = 'left'
            member.save(update_fields=['status', 'updated_at'])
            return Response({'message': 'Left the room.'})
        except RoomMember.DoesNotExist:
            return Response(
                {'error': 'You are not a member of this room.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=True, methods=['get', 'post'], permission_classes=[IsAuthenticated])
    def messages(self, request, pk=None):
        """Get or send messages in a room."""
        room = self.get_object()
        if request.method == 'GET':
            messages = RoomMessage.objects.filter(
                room=room, is_active=True,
            ).select_related('sender')[:50]
            serializer = RoomMessageSerializer(messages, many=True)
            return Response(serializer.data)

        serializer = RoomMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(room=room, sender=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RoomMemberViewSet(viewsets.ModelViewSet):
    """ViewSet for room members."""
    serializer_class = RoomMemberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RoomMember.objects.filter(
            room_id=self.kwargs.get('room_pk'),
        ).select_related('user')
