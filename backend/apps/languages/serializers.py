"""
Serializers for languages app.
"""
from rest_framework import serializers

from apps.languages.models import Language, TravelPhrase, PhraseTranslation


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'name', 'code', 'script', 'is_supported']
        read_only_fields = ['id']


class PhraseTranslationSerializer(serializers.ModelSerializer):
    language_name = serializers.CharField(source='language.name', read_only=True)
    language_code = serializers.CharField(source='language.code', read_only=True)

    class Meta:
        model = PhraseTranslation
        fields = [
            'id', 'phrase', 'language', 'language_name', 'language_code',
            'translated_text', 'pronunciation',
        ]
        read_only_fields = ['id']


class TravelPhraseSerializer(serializers.ModelSerializer):
    translations = PhraseTranslationSerializer(many=True, read_only=True)

    class Meta:
        model = TravelPhrase
        fields = ['id', 'category', 'english_text', 'translations']
        read_only_fields = ['id']


class TranslateRequestSerializer(serializers.Serializer):
    """Input serializer for translation requests."""
    text = serializers.CharField(max_length=500)
    target_language = serializers.CharField(max_length=10)
