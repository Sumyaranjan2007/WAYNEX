"""
Language models for WAYNEX.
Languages, travel phrases, and translations.
"""
from django.db import models

from core.models import BaseModel


class Language(BaseModel):
    """Supported language."""

    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True, help_text='ISO 639-1 code.')
    script = models.CharField(max_length=50, blank=True, help_text='Script name (e.g., Devanagari).')
    is_supported = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Language'
        verbose_name_plural = 'Languages'

    def __str__(self):
        return f'{self.name} ({self.code})'


class TravelPhrase(BaseModel):
    """Common travel phrase in English."""

    CATEGORY_CHOICES = [
        ('greeting', 'Greeting'),
        ('direction', 'Direction'),
        ('food', 'Food & Dining'),
        ('transport', 'Transport'),
        ('shopping', 'Shopping'),
        ('emergency', 'Emergency'),
        ('accommodation', 'Accommodation'),
        ('general', 'General'),
        ('numbers', 'Numbers'),
        ('time', 'Time'),
    ]

    category = models.CharField(
        max_length=20, choices=CATEGORY_CHOICES, default='general',
    )
    english_text = models.CharField(max_length=500)

    class Meta:
        ordering = ['category', 'english_text']
        verbose_name = 'Travel Phrase'
        verbose_name_plural = 'Travel Phrases'

    def __str__(self):
        return f'{self.english_text} [{self.category}]'


class PhraseTranslation(BaseModel):
    """Translation of a travel phrase into a language."""

    phrase = models.ForeignKey(
        TravelPhrase, on_delete=models.CASCADE,
        related_name='translations',
    )
    language = models.ForeignKey(
        Language, on_delete=models.CASCADE,
        related_name='translations',
    )
    translated_text = models.CharField(max_length=500)
    pronunciation = models.CharField(
        max_length=500, blank=True,
        help_text='Romanized pronunciation guide.',
    )

    class Meta:
        ordering = ['language', 'phrase']
        unique_together = ['phrase', 'language']
        verbose_name = 'Phrase Translation'
        verbose_name_plural = 'Phrase Translations'

    def __str__(self):
        return f'{self.phrase.english_text} → {self.language.name}: {self.translated_text}'
