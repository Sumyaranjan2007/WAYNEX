"""
Tests for budget app.
"""
from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.destinations.models import State, Destination
from apps.budget.models import BudgetProfile

User = get_user_model()


class BudgetAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='budget_traveler',
            email='budget@waynex.test',
            password='Password123!',
        )
        self.client.force_authenticate(user=self.user)
        self.state = State.objects.create(name='Karnataka', code='KA', capital='Bengaluru')
        self.destination = Destination.objects.create(
            name='Mysuru',
            state=self.state,
            category='city',
            estimated_budget_per_day=Decimal('1500.00'),
        )

    def test_create_budget_profile(self):
        payload = {
            'starting_location': 'Bengaluru',
            'budget_amount': '5000.00',
            'num_days': 3,
            'num_travellers': 2,
            'travel_type': 'solo',
            'transport_pref': 'budget',
            'accommodation_pref': 'hostel',
            'food_pref': 'street_food',
        }
        response = self.client.post('/api/v1/budget/profiles/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BudgetProfile.objects.filter(user=self.user).count(), 1)

    def test_budget_estimate(self):
        payload = {
            'starting_location': 'Bengaluru',
            'destination_id': str(self.destination.id),
            'num_days': 2,
            'num_travellers': 1,
            'transport_pref': 'budget',
            'accommodation_pref': 'budget_hotel',
            'food_pref': 'local_restaurants',
        }
        response = self.client.post('/api/v1/budget/estimate/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_estimated_cost', response.data)
