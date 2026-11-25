"""
Account models for WAYNEX.
Custom User model and UserProfile.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models

from core.models import BaseModel


class User(AbstractUser):
    """Extended User model for WAYNEX."""

    USER_TYPE_CHOICES = [
        ('traveller', 'Traveller'),
        ('contributor', 'Contributor'),
        ('admin', 'Admin'),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=__import__('uuid').uuid4,
        editable=False,
    )
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='traveller',
    )
    is_verified = models.BooleanField(default=False)
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        ordering = ['-date_joined']
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f'{self.username} ({self.email})'


class UserProfile(BaseModel):
    """Extended profile information for users."""

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
    )
    travel_preferences = models.JSONField(
        default=dict,
        blank=True,
        help_text='User travel preferences (budget, style, interests).',
    )
    languages_known = models.CharField(
        max_length=255,
        blank=True,
        help_text='Comma-separated list of languages known.',
    )
    home_city = models.CharField(max_length=100, blank=True)
    trust_score = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=0.00,
        help_text='Trust score based on contributions and verifications.',
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f'Profile: {self.user.username}'


