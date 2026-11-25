"""
Tests for accounts app.
Verifies registration, login (JWT), token refresh, and profile management.
"""
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AccountsAPITests(APITestCase):
    def setUp(self):
        self.register_url = reverse('accounts:register')
        self.login_url = reverse('accounts:login')
        self.refresh_url = reverse('accounts:token_refresh')
        self.profile_url = reverse('accounts:profile')

        self.user_data = {
            'username': 'testtraveller',
            'email': 'traveller@waynex.in',
            'password': 'SecurePassword123!',
            'password_confirm': 'SecurePassword123!',
            'phone': '+919876543210',
            'user_type': 'traveller',
            'bio': 'Passionate explorer of Karnataka heritage.',
        }

    def test_user_registration(self):
        """Test registering a new user."""
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], 'traveller@waynex.in')
        self.assertEqual(response.data['user']['username'], 'testtraveller')

        # Verify user exists in database and profile is auto-created
        user = User.objects.get(email='traveller@waynex.in')
        self.assertTrue(hasattr(user, 'profile'))

    def test_registration_password_mismatch(self):
        """Test registration fails when passwords do not match."""
        bad_data = self.user_data.copy()
        bad_data['password_confirm'] = 'DifferentPassword123!'
        response = self.client.post(self.register_url, bad_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password_confirm', response.data)

    def test_user_login_jwt(self):
        """Test obtaining JWT tokens via login."""
        # Create user
        User.objects.create_user(
            username=self.user_data['username'],
            email=self.user_data['email'],
            password=self.user_data['password'],
        )

        login_payload = {
            'email': self.user_data['email'],
            'password': self.user_data['password'],
        }
        response = self.client.post(self.login_url, login_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

        # Test token refresh
        refresh_payload = {'refresh': response.data['refresh']}
        refresh_response = self.client.post(self.refresh_url, refresh_payload, format='json')
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh_response.data)

    def test_user_profile_authenticated(self):
        """Test retrieving authenticated user profile."""
        user = User.objects.create_user(
            username='authuser',
            email='auth@waynex.in',
            password='TestPassword123!',
        )
        self.client.force_authenticate(user=user)

        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'auth@waynex.in')
        self.assertEqual(response.data['username'], 'authuser')

    def test_user_profile_unauthenticated(self):
        """Test unauthenticated user cannot access profile."""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
