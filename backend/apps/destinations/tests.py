"""
Tests for destinations app.
Verifies state listing, destination listing/detail views, and search endpoint.
"""
from decimal import Decimal
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.destinations.models import State, District, Destination, Attraction


class DestinationsAPITests(APITestCase):
    def setUp(self):
        self.state = State.objects.create(
            name="Karnataka",
            slug="karnataka",
            code="KA",
            capital="Bengaluru",
            description="Heritage, technology, and coastal wonder.",
            latitude=Decimal("15.3173"),
            longitude=Decimal("75.7139"),
            is_union_territory=False,
        )

        self.district = District.objects.create(
            name="Vijayanagara",
            slug="vijayanagara-karnataka",
            state=self.state,
            headquarters="Hosapete",
        )

        self.destination = Destination.objects.create(
            name="Hampi",
            slug="hampi-karnataka",
            state=self.state,
            district=self.district,
            category="heritage_site",
            description="UNESCO World Heritage ruins of Vijayanagara Empire.",
            why_famous="Stone Chariot and grand monolithic ruins.",
            highlights=["Stone Chariot", "Virupaksha Temple"],
            latitude=Decimal("15.3350"),
            longitude=Decimal("76.4620"),
            estimated_budget_per_day=Decimal("1500.00"),
            rating=Decimal("4.9"),
            review_count=1420,
            is_hidden_gem=False,
            is_trending=True,
        )

        self.attraction = Attraction.objects.create(
            name="Vijaya Vittala Temple",
            destination=self.destination,
            category="historical",
            entry_fee=Decimal("40.00"),
            opening_hours="8:30 AM - 5:30 PM",
            visit_duration="3 hours",
        )

    def test_state_list_api(self):
        """Test GET /api/v1/states/ returns list of states."""
        url = reverse('states:state-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Results can be paginated or direct list
        results = response.data.get('results', response.data)
        self.assertGreaterEqual(len(results), 1)
        self.assertEqual(results[0]['name'], 'Karnataka')
        self.assertEqual(results[0]['code'], 'KA')

    def test_destination_list_api(self):
        """Test GET /api/v1/destinations/ returns destination list."""
        url = reverse('destinations:destination-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        self.assertGreaterEqual(len(results), 1)
        self.assertEqual(results[0]['name'], 'Hampi')

    def test_destination_detail_api(self):
        """Test GET /api/v1/destinations/<slug>/ returns complete details including attractions."""
        url = reverse('destinations:destination-detail', kwargs={'slug': self.destination.slug})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Hampi')
        self.assertEqual(response.data['state_name'], 'Karnataka')
        self.assertEqual(response.data['category'], 'heritage_site')
        self.assertIn('attractions', response.data)
        self.assertEqual(len(response.data['attractions']), 1)
        self.assertEqual(response.data['attractions'][0]['name'], 'Vijaya Vittala Temple')

    def test_destination_search_action(self):
        """Test GET /api/v1/destinations/search/?q=Hampi returns matching destinations."""
        url = reverse('destinations:destination-search')
        response = self.client.get(url, {'q': 'Hampi'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Hampi')

    def test_destination_search_no_match(self):
        """Test GET /api/v1/destinations/search/?q=NonExistent returns empty results."""
        url = reverse('destinations:destination-search')
        response = self.client.get(url, {'q': 'NonExistentPlaceXYZ'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 0)
