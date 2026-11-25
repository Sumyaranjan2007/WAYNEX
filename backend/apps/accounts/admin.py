"""
Admin configuration for accounts app.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from apps.accounts.models import User, UserProfile


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = [
        'username', 'email', 'phone', 'user_type', 'is_verified',
        'is_active', 'date_joined',
    ]
    list_filter = ['user_type', 'is_verified', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'phone']
    inlines = [UserProfileInline]
    fieldsets = BaseUserAdmin.fieldsets + (
        ('WAYNEX Fields', {
            'fields': ('phone', 'avatar', 'user_type', 'is_verified', 'bio'),
        }),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'home_city', 'trust_score', 'created_at']
    list_filter = ['home_city']
    search_fields = ['user__username', 'user__email', 'home_city']
    readonly_fields = ['created_at', 'updated_at']
