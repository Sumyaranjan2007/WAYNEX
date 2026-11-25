"""
Budget estimation service for WAYNEX.
"""
from decimal import Decimal

from apps.destinations.models import Destination
from apps.accommodation.models import AccommodationProvider


class BudgetEstimationService:
    """Service for estimating travel budgets."""

    # Average daily costs by preference in INR
    TRANSPORT_COSTS = {
        'budget': Decimal('500'),
        'comfort': Decimal('1500'),
        'luxury': Decimal('3500'),
        'any': Decimal('1000'),
    }

    FOOD_COSTS = {
        'street_food': Decimal('300'),
        'local_restaurants': Decimal('600'),
        'mid_range': Decimal('1200'),
        'fine_dining': Decimal('3000'),
        'any': Decimal('600'),
    }

    ACCOMMODATION_COSTS = {
        'hostel': Decimal('500'),
        'budget_hotel': Decimal('1000'),
        'mid_range': Decimal('2500'),
        'luxury': Decimal('6000'),
        'homestay': Decimal('800'),
        'any': Decimal('1200'),
    }

    ACTIVITY_COST_PER_DAY = Decimal('500')
    EMERGENCY_RESERVE_PERCENT = Decimal('0.10')

    def estimate(
        self, destination, num_days, num_travellers,
        transport_pref='any', accommodation_pref='any', food_pref='any',
    ):
        """Estimate total trip cost."""
        transport_per_day = self.TRANSPORT_COSTS.get(
            transport_pref, self.TRANSPORT_COSTS['any'],
        )

        # Try to use real accommodation data
        accommodation_per_night = self._get_accommodation_cost(
            destination, accommodation_pref,
        )

        food_per_day = self.FOOD_COSTS.get(
            food_pref, self.FOOD_COSTS['any'],
        )

        activity_per_day = self.ACTIVITY_COST_PER_DAY
        if destination.estimated_budget_per_day:
            activity_per_day = destination.estimated_budget_per_day * Decimal('0.2')

        transport_cost = transport_per_day * num_days * num_travellers
        accommodation_cost = accommodation_per_night * (num_days - 1 if num_days > 1 else 1) * max(1, num_travellers // 2)
        food_cost = food_per_day * num_days * num_travellers
        activities_cost = activity_per_day * num_days * num_travellers

        subtotal = transport_cost + accommodation_cost + food_cost + activities_cost
        emergency_reserve = subtotal * self.EMERGENCY_RESERVE_PERCENT
        total = subtotal + emergency_reserve

        return {
            'transport_cost': transport_cost,
            'accommodation_cost': accommodation_cost,
            'food_cost': food_cost,
            'activities_cost': activities_cost,
            'emergency_reserve': emergency_reserve,
            'total_estimated_cost': total,
        }

    def _get_accommodation_cost(self, destination, pref):
        """Get accommodation cost from real data or fallback to estimates."""
        providers = AccommodationProvider.objects.filter(
            destination=destination, is_active=True,
        )
        if providers.exists():
            avg_min = providers.aggregate(
                avg=__import__('django.db.models', fromlist=['Avg']).Avg('price_per_night_min'),
            )['avg']
            if avg_min:
                return Decimal(str(avg_min))

        return self.ACCOMMODATION_COSTS.get(pref, self.ACCOMMODATION_COSTS['any'])
