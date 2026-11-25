"""
Core pagination for WAYNEX.
"""
from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
    """Standard pagination with configurable page size."""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class LargeResultsSetPagination(PageNumberPagination):
    """Larger pagination for list endpoints that may return many results."""
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 200


class SmallResultsSetPagination(PageNumberPagination):
    """Small pagination for endpoints with heavy data."""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50
