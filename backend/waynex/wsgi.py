"""
WSGI config for WAYNEX project.
"""
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'waynex.settings')

application = get_wsgi_application()
