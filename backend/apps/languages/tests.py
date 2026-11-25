"""
Tests for assistant and language apps.
"""
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.languages.models import Language, TravelPhrase, PhraseTranslation


class AssistantAndLanguagesAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.lang_kn = Language.objects.create(name='Kannada', code='kn', script='Kannada', is_supported=True)
        self.phrase = TravelPhrase.objects.create(english_text='Hello', category='greeting')
        self.translation = PhraseTranslation.objects.create(
            phrase=self.phrase, language=self.lang_kn,
            translated_text='ನಮಸ್ಕಾರ', pronunciation='Namaskara'
        )

    def test_list_languages(self):
        response = self.client.get('/api/v1/languages/list/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)

    def test_translate_phrase(self):
        payload = {
            'text': 'Hello',
            'target_language': 'kn',
        }
        response = self.client.post('/api/v1/languages/translate/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['translations'][0]['translated_text'], 'ನಮಸ್ಕಾರ')

    def test_assistant_chat_endpoint(self):
        payload = {
            'message': 'Where should I go for coffee plantations in Karnataka?',
            'history': [],
        }
        response = self.client.post('/api/v1/assistant/chat/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('response', response.data)
