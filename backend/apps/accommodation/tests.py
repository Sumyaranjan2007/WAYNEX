"""
Tests for accommodation app.
"""
from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.destinations.models import State, Destination
from apps.accommodation.models import AccommodationProvider


class AccommodationAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.state = State.objects.create(name='Karnataka', code='KA', capital='Bengaluru')
        self.destination = Destination.objects.create(
            name='Hampi',
            state=self.state,
            category='heritage_site',
        )
        self.provider = AccommodationProvider.objects.create(
            name='Hampi Heritage Homestay',
            provider_type='homestay',
            destination=self.destination,
            address='Near Virupaksha Temple, Hampi',
            price_per_night_min=Decimal('800.00'),
            price_per_night_max=Decimal('1500.00'),
            rating=Decimal('4.8'),
            is_verified=True,
        )

    def test_list_accommodations(self):
        response = self.client.get('/api/v1/accommodation/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_filter_by_type(self):
        response = self.client.get('/api/v1/accommodation/?provider_type=homestay')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
