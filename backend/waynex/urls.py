"""
WAYNEX URL Configuration.
All API endpoints are under /api/v1/.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/states/', include('apps.destinations.urls_states')),
    path('api/v1/districts/', include('apps.destinations.urls_districts')),
    path('api/v1/destinations/', include('apps.destinations.urls_destinations')),
    path('api/v1/transport/', include('apps.transport.urls')),
    path('api/v1/budget/', include('apps.budget.urls')),
    path('api/v1/accommodation/', include('apps.accommodation.urls')),
    path('api/v1/safety/', include('apps.safety.urls')),
    path('api/v1/social/', include('apps.social.urls')),
    path('api/v1/assistant/', include('apps.assistant.urls')),
    path('api/v1/languages/', include('apps.languages.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
