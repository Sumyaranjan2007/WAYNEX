"""
Social models for WAYNEX.
Travel rooms, members, messages, and polls.
"""
from django.conf import settings
from django.db import models

from core.models import BaseModel


class TravelRoom(BaseModel):
    """Travel room for group trip planning."""

    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
        ('unlisted', 'Unlisted'),
    ]

    JOIN_APPROVAL_CHOICES = [
        ('auto', 'Auto Approve'),
        ('manual', 'Manual Approval'),
        ('invite_only', 'Invite Only'),
    ]

    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('confirmed', 'Confirmed'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='created_rooms',
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    destination = models.ForeignKey(
        'destinations.Destination', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='travel_rooms',
    )
    destination_city = models.CharField(max_length=150, blank=True, default='')
    state_name = models.CharField(max_length=150, blank=True, default='')
    cover_image = models.CharField(max_length=500, blank=True, default='')
    duration_days = models.PositiveIntegerField(default=3)
    min_budget = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
    )
    max_budget = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
    )
    travel_style = models.CharField(max_length=50, default='backpacking')
    transport_preference = models.CharField(max_length=50, default='bus')
    room_rules = models.TextField(blank=True, default='')
    live_mode = models.BooleanField(default=False)
    starting_location = models.CharField(max_length=200, blank=True)
    travel_dates_start = models.DateField(null=True, blank=True)
    travel_dates_end = models.DateField(null=True, blank=True)
    budget_per_person = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text='Budget per person in INR.',
    )
    max_members = models.PositiveIntegerField(default=10)
    travel_interests = models.JSONField(
        default=list, blank=True,
        help_text='Shared travel interests.',
    )
    visibility = models.CharField(
        max_length=10, choices=VISIBILITY_CHOICES, default='public',
    )
    join_approval = models.CharField(
        max_length=15, choices=JOIN_APPROVAL_CHOICES, default='auto',
    )
    women_only = models.BooleanField(default=False)
    status = models.CharField(
        max_length=15, choices=STATUS_CHOICES, default='planning',
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Travel Room'
        verbose_name_plural = 'Travel Rooms'

    def __str__(self):
        return f'{self.name} (by {self.creator.username})'

    @property
    def member_count(self):
        return self.members.filter(status='approved').count()


class RoomMember(BaseModel):
    """Member of a travel room."""

    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('moderator', 'Moderator'),
        ('member', 'Member'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('left', 'Left'),
        ('banned', 'Banned'),
    ]

    room = models.ForeignKey(
        TravelRoom, on_delete=models.CASCADE, related_name='members',
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='room_memberships',
    )
    role = models.CharField(
        max_length=15, choices=ROLE_CHOICES, default='member',
    )
    status = models.CharField(
        max_length=15, choices=STATUS_CHOICES, default='pending',
    )
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-joined_at']
        unique_together = ['room', 'user']
        verbose_name = 'Room Member'
        verbose_name_plural = 'Room Members'

    def __str__(self):
        return f'{self.user.username} in {self.room.name} ({self.role})'


class RoomMessage(BaseModel):
    """Message in a travel room."""

    MESSAGE_TYPE_CHOICES = [
        ('text', 'Text'),
        ('image', 'Image'),
        ('location', 'Location'),
        ('poll', 'Poll'),
        ('system', 'System'),
    ]

    room = models.ForeignKey(
        TravelRoom, on_delete=models.CASCADE, related_name='messages',
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='room_messages',
    )
    message_type = models.CharField(
        max_length=10, choices=MESSAGE_TYPE_CHOICES, default='text',
    )
    content = models.TextField()

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Room Message'
        verbose_name_plural = 'Room Messages'

    def __str__(self):
        return f'{self.sender.username}: {self.content[:50]}...'


class RoomPoll(BaseModel):
    """Poll in a travel room."""

    room = models.ForeignKey(
        TravelRoom, on_delete=models.CASCADE, related_name='polls',
    )
    question = models.CharField(max_length=500)
    options = models.JSONField(
        default=list,
        help_text='List of poll options.',
    )
    votes = models.JSONField(
        default=dict, blank=True,
        help_text='Mapping of option index to list of user IDs.',
    )
    is_active_poll = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Room Poll'
        verbose_name_plural = 'Room Polls'

    def __str__(self):
        return f'Poll: {self.question[:50]}...'


class RoomJoinRequest(BaseModel):
    """Join request for private or approval-required rooms."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    ]

    room = models.ForeignKey(
        TravelRoom, on_delete=models.CASCADE, related_name='join_requests',
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='room_join_requests',
    )
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    class Meta:
        ordering = ['-created_at']
        unique_together = ['room', 'user']


class RoomItineraryItem(BaseModel):
    """Collaborative itinerary proposal in a travel room."""
    room = models.ForeignKey(
        TravelRoom, on_delete=models.CASCADE, related_name='itinerary_items',
    )
    day_number = models.PositiveIntegerField(default=1)
    time_slot = models.CharField(max_length=50, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, default='attraction')
    entry_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    votes_count = models.PositiveIntegerField(default=0)
    voter_ids = models.JSONField(default=list, blank=True)
    is_confirmed = models.BooleanField(default=False)
    suggested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
    )

    class Meta:
        ordering = ['day_number', 'created_at']


class RoomExpense(BaseModel):
    """Shared group expense in a travel room."""
    room = models.ForeignKey(
        TravelRoom, on_delete=models.CASCADE, related_name='expenses',
    )
    title = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, default='food')
    paid_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='paid_expenses',
    )
    split_among = models.JSONField(default=list, blank=True)
    receipt_url = models.CharField(max_length=500, blank=True)

    class Meta:
        ordering = ['-created_at']


class RoomMemory(BaseModel):
    """Post-trip shared photo or travel story."""
    room = models.ForeignKey(
        TravelRoom, on_delete=models.CASCADE, related_name='memories',
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='shared_memories',
    )
    image_url = models.CharField(max_length=500)
    caption = models.TextField(blank=True)
    location_name = models.CharField(max_length=200, blank=True)

    class Meta:
        ordering = ['-created_at']


class TravelConnection(BaseModel):
    """Travel buddy connection between two users."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    from_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='connections_sent',
    )
    to_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='connections_received',
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    class Meta:
        ordering = ['-created_at']
        unique_together = ['from_user', 'to_user']

