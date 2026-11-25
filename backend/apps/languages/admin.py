"""
Admin configuration for languages app.
"""
from django.contrib import admin

from apps.languages.models import Language, TravelPhrase, PhraseTranslation


class PhraseTranslationInline(admin.TabularInline):
    model = PhraseTranslation
    extra = 0
    fields = ['language', 'translated_text', 'pronunciation']


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'script', 'is_supported', 'is_active']
    list_filter = ['is_supported', 'is_active']
    search_fields = ['name', 'code']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(TravelPhrase)
class TravelPhraseAdmin(admin.ModelAdmin):
    list_display = ['english_text', 'category', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['english_text']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [PhraseTranslationInline]


@admin.register(PhraseTranslation)
class PhraseTranslationAdmin(admin.ModelAdmin):
    list_display = [
        'phrase', 'language', 'translated_text', 'pronunciation',
    ]
    list_filter = ['language']
    search_fields = ['translated_text', 'phrase__english_text']
    readonly_fields = ['created_at', 'updated_at']
