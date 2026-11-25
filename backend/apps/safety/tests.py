"""
Tests for safety app.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.safety.models import TrustedContact, EmergencySession

User = get_user_model()


class SafetyAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='safe_traveler',
            email='safe@waynex.test',
            password='Password123!',
        )
        self.client.force_authenticate(user=self.user)

    def test_add_trusted_contact(self):
        payload = {
            'name': 'Priya Sharma',
            'phone': '+919876543210',
            'relationship': 'friend',
            'is_primary': True,
        }
        response = self.client.post('/api/v1/safety/contacts/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TrustedContact.objects.filter(user=self.user).count(), 1)

    def test_trigger_emergency_session_and_resolve(self):
        # Trigger emergency session
        payload = {
            'latitude': '12.9716',
            'longitude': '77.5946',
            'location_accuracy': '10.5',
            'notes': 'Test SOS trigger',
        }
        response = self.client.post('/api/v1/safety/sessions/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        session_id = response.data['id']

        # Resolve session
        resolve_response = self.client.post(f'/api/v1/safety/sessions/{session_id}/resolve/')
        self.assertEqual(resolve_response.status_code, status.HTTP_200_OK)
        self.assertEqual(resolve_response.data['status'], 'resolved')
