"""
Filters for destinations app.
"""
import django_filters

from apps.destinations.models import Destination, State, District


class DestinationFilter(django_filters.FilterSet):
    """Filter for destinations."""
    state = django_filters.UUIDFilter(field_name='state__id')
    state_code = django_filters.CharFilter(field_name='state__code', lookup_expr='iexact')
    district = django_filters.UUIDFilter(field_name='district__id')
    category = django_filters.ChoiceFilter(choices=Destination.CATEGORY_CHOICES)
    is_hidden_gem = django_filters.BooleanFilter()
    is_trending = django_filters.BooleanFilter()
    min_rating = django_filters.NumberFilter(field_name='rating', lookup_expr='gte')
    max_budget = django_filters.NumberFilter(
        field_name='estimated_budget_per_day', lookup_expr='lte',
    )
    name = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Destination
        fields = [
            'state', 'state_code', 'district', 'category',
            'is_hidden_gem', 'is_trending', 'min_rating', 'max_budget', 'name',
        ]


class StateFilter(django_filters.FilterSet):
    """Filter for states."""
    is_union_territory = django_filters.BooleanFilter()
    name = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = State
        fields = ['is_union_territory', 'name']


class DistrictFilter(django_filters.FilterSet):
    """Filter for districts."""
    state = django_filters.UUIDFilter(field_name='state__id')
    state_code = django_filters.CharFilter(field_name='state__code', lookup_expr='iexact')
    name = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = District
        fields = ['state', 'state_code', 'name']
