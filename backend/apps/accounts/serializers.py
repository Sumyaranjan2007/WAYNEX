"""
Serializers for accounts app.
"""
from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.accounts.models import UserProfile

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'password_confirm',
            'phone', 'user_type', 'bio',
        ]
        read_only_fields = ['id']

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError(
                {'password_confirm': 'Passwords do not match.'}
            )
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile."""

    class Meta:
        model = UserProfile
        fields = [
            'id', 'travel_preferences', 'languages_known',
            'home_city', 'trust_score', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'trust_score', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    """Full user serializer with profile."""
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'phone', 'avatar', 'user_type',
            'is_verified', 'bio', 'date_joined', 'profile',
        ]
        read_only_fields = ['id', 'is_verified', 'date_joined']


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user info."""

    class Meta:
        model = User
        fields = ['username', 'phone', 'avatar', 'bio']
