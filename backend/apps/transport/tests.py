"""
Tests for transport app.
"""
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.transport.models import TransportAgency, TransportStop, TransportRoute
from apps.destinations.models import State


class TransportAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.state = State.objects.create(name='Karnataka', code='KA', capital='Bengaluru')
        self.agency = TransportAgency.objects.create(
            name='KSRTC', code='KSRTC', state=self.state, agency_type='bus'
        )
        self.stop_origin = TransportStop.objects.create(
            name='Bengaluru Majestic', city='Bengaluru', state=self.state, agency=self.agency
        )
        self.stop_dest = TransportStop.objects.create(
            name='Mysuru Suburb Bus Stand', city='Mysuru', state=self.state, agency=self.agency
        )
        self.route = TransportRoute.objects.create(
            agency=self.agency,
            name='Bengaluru to Mysuru Express',
            route_number='KA-01-EXP',
            origin_stop=self.stop_origin,
            destination_stop=self.stop_dest,
            distance_km=145.0,
            duration_minutes=180,
            fare_estimate=220.00,
        )

    def test_list_transport_agencies(self):
        response = self.client.get('/api/v1/transport/agencies/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)

    def test_list_transport_stops(self):
        response = self.client.get('/api/v1/transport/stops/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 2)

    def test_list_transport_routes(self):
        response = self.client.get('/api/v1/transport/routes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_journey_search(self):
        payload = {
            'origin': 'Bengaluru',
            'destination': 'Mysuru',
            'transport_type': 'all',
        }
        response = self.client.post('/api/v1/transport/journey/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
