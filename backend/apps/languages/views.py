"""
Views for languages app.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend

from apps.languages.models import Language, TravelPhrase, PhraseTranslation
from apps.languages.serializers import (
    LanguageSerializer, TravelPhraseSerializer,
    PhraseTranslationSerializer, TranslateRequestSerializer,
)


class LanguageViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for supported languages."""
    queryset = Language.objects.filter(is_supported=True, is_active=True)
    serializer_class = LanguageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_supported']


class TravelPhraseViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for travel phrases with translations."""
    queryset = TravelPhrase.objects.active().prefetch_related(
        'translations__language',
    )
    serializer_class = TravelPhraseSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']

    @action(detail=False, methods=['get'])
    def by_language(self, request):
        """Get phrases filtered by target language."""
        lang_code = request.query_params.get('lang', '')
        category = request.query_params.get('category', '')

        if not lang_code:
            return Response(
                {'error': 'Please provide a language code via "lang" parameter.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        translations = PhraseTranslation.objects.filter(
            language__code=lang_code, is_active=True,
        ).select_related('phrase', 'language')

        if category:
            translations = translations.filter(phrase__category=category)

        serializer = PhraseTranslationSerializer(translations, many=True)
        return Response(serializer.data)


from rest_framework import permissions

class TranslateView(APIView):
    """Translate text by looking up phrase translations."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = TranslateRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        text = serializer.validated_data['text']
        target_lang = serializer.validated_data['target_language']

        # Look up exact or partial match
        translations = PhraseTranslation.objects.filter(
            language__code=target_lang,
            phrase__english_text__iexact=text,
            is_active=True,
        ).select_related('phrase', 'language')

        if not translations.exists():
            # Try partial match
            translations = PhraseTranslation.objects.filter(
                language__code=target_lang,
                phrase__english_text__icontains=text,
                is_active=True,
            ).select_related('phrase', 'language')[:5]

        if translations.exists():
            return Response({
                'source_text': text,
                'target_language': target_lang,
                'translations': PhraseTranslationSerializer(
                    translations, many=True,
                ).data,
            })

        return Response({
            'source_text': text,
            'target_language': target_lang,
            'translations': [],
            'message': 'No translation found. Try the AI assistant for real-time translation.',
        })
