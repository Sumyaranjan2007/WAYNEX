"""
Tests for social app (travel rooms).
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.social.models import TravelRoom, RoomMember

User = get_user_model()


class SocialAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(
            username='traveler_one',
            email='one@waynex.test',
            password='Password123!',
        )
        self.user2 = User.objects.create_user(
            username='traveler_two',
            email='two@waynex.test',
            password='Password123!',
        )
        self.client.force_authenticate(user=self.user1)

    def test_create_and_join_travel_room(self):
        # Create room
        payload = {
            'name': 'Gokarna Beach Backpackers',
            'description': 'Exploring Gokarna beaches and cliffside trails',
            'visibility': 'public',
            'join_approval': 'auto',
            'max_members': 5,
        }
        response = self.client.post('/api/v1/social/rooms/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        room_id = response.data['id']

        # Verify creator is admin member
        self.assertEqual(RoomMember.objects.filter(room_id=room_id, user=self.user1).count(), 1)

        # Switch to user2 and join room
        self.client.force_authenticate(user=self.user2)
        join_response = self.client.post(f'/api/v1/social/rooms/{room_id}/join/')
        self.assertEqual(join_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(RoomMember.objects.filter(room_id=room_id).count(), 2)
