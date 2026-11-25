"""
Views for social app.
Travel rooms, collaborative itinerary, group budget, real-time messaging, and travel buddy connections.
"""
from rest_framework import viewsets, status, filters, permissions
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from apps.social.models import (
    TravelRoom, RoomMember, RoomMessage, RoomPoll,
    RoomJoinRequest, RoomItineraryItem, RoomExpense, RoomMemory, TravelConnection,
)
from apps.social.serializers import (
    TravelRoomListSerializer, TravelRoomDetailSerializer,
    RoomMemberSerializer, RoomMessageSerializer, RoomPollSerializer,
    RoomItineraryItemSerializer, RoomExpenseSerializer, RoomMemorySerializer,
    TravelConnectionSerializer,
)


class TravelRoomViewSet(viewsets.ModelViewSet):
    """ViewSet for travel rooms."""
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'destination_city', 'state_name']
    filterset_fields = ['visibility', 'status', 'women_only', 'travel_style']
    ordering_fields = ['created_at', 'travel_dates_start', 'budget_per_person']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = TravelRoom.objects.filter(is_active=True).select_related('creator', 'destination')
        user = self.request.user
        if self.action == 'list':
            if user and user.is_authenticated:
                return qs.filter(
                    Q(visibility='public')
                    | Q(creator=user)
                    | Q(members__user=user),
                ).distinct()
            return qs.filter(visibility='public')
        return qs

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TravelRoomDetailSerializer
        return TravelRoomListSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve', 'messages', 'itinerary', 'expenses', 'memories'):
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        user = self.request.user if (self.request.user and self.request.user.is_authenticated) else None
        room = serializer.save(creator=user)
        if user:
            RoomMember.objects.create(
                room=room, user=user,
                role='admin', status='approved',
            )

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def join(self, request, pk=None):
        """Join or request to join a travel room."""
        room = self.get_object()
        if room.member_count >= room.max_members:
            return Response({'error': 'Room has reached maximum capacity.'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        if not user or not user.is_authenticated:
            # Anonymous join mock / session support
            return Response({'message': 'Join request noted for guest traveler.'}, status=status.HTTP_200_OK)

        member, created = RoomMember.objects.get_or_create(
            room=room, user=user,
            defaults={'status': 'approved' if room.join_approval == 'auto' else 'pending'},
        )
        if not created:
            return Response({'error': 'You have already requested to join or are a member.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(RoomMemberSerializer(member).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def leave(self, request, pk=None):
        """Leave a travel room."""
        room = self.get_object()
        if request.user.is_authenticated:
            try:
                member = RoomMember.objects.get(room=room, user=request.user)
                member.status = 'left'
                member.save(update_fields=['status', 'updated_at'])
                return Response({'message': 'Left the room successfully.'})
            except RoomMember.DoesNotExist:
                pass
        return Response({'message': 'Left the room.'})

    @action(detail=True, methods=['get', 'post'], permission_classes=[AllowAny])
    def messages(self, request, pk=None):
        """Get or send messages in a room."""
        room = self.get_object()
        if request.method == 'GET':
            messages = RoomMessage.objects.filter(room=room, is_active=True).select_related('sender')[:100]
            return Response(RoomMessageSerializer(messages, many=True).data)

        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required to post messages.'}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = RoomMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(room=room, sender=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get', 'post'], permission_classes=[AllowAny])
    def itinerary(self, request, pk=None):
        """Get or propose collaborative itinerary items."""
        room = self.get_object()
        if request.method == 'GET':
            items = RoomItineraryItem.objects.filter(room=room, is_active=True)
            return Response(RoomItineraryItemSerializer(items, many=True).data)

        serializer = RoomItineraryItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user if request.user.is_authenticated else None
        serializer.save(room=room, suggested_by=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def vote_itinerary(self, request, pk=None):
        """Vote on an itinerary item."""
        item_id = request.data.get('item_id')
        try:
            item = RoomItineraryItem.objects.get(id=item_id, room_id=pk)
            item.votes_count += 1
            item.save(update_fields=['votes_count'])
            return Response({'votes_count': item.votes_count, 'status': 'voted'})
        except RoomItineraryItem.DoesNotExist:
            return Response({'error': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get', 'post'], permission_classes=[AllowAny])
    def expenses(self, request, pk=None):
        """Get or log group expenses."""
        room = self.get_object()
        if request.method == 'GET':
            expenses = RoomExpense.objects.filter(room=room, is_active=True).select_related('paid_by')
            return Response(RoomExpenseSerializer(expenses, many=True).data)

        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required to record expenses.'}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = RoomExpenseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(room=room, paid_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get', 'post'], permission_classes=[AllowAny])
    def memories(self, request, pk=None):
        """Get or upload shared post-trip memories."""
        room = self.get_object()
        if request.method == 'GET':
            memories = RoomMemory.objects.filter(room=room, is_active=True).select_related('user')
            return Response(RoomMemorySerializer(memories, many=True).data)

        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required to upload memories.'}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = RoomMemorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(room=room, user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TravelConnectionViewSet(viewsets.ModelViewSet):
    """ViewSet for travel buddy connections."""
    serializer_class = TravelConnectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return TravelConnection.objects.filter(Q(from_user=user) | Q(to_user=user), is_active=True)
