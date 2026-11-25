"""
Core throttling for WAYNEX.
"""
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class AnonBurstRateThrottle(AnonRateThrottle):
    """Throttle for anonymous users - burst rate."""
    scope = 'anon_burst'


class UserBurstRateThrottle(UserRateThrottle):
    """Throttle for authenticated users - burst rate."""
    scope = 'user_burst'


class AnonSustainedRateThrottle(AnonRateThrottle):
    """Throttle for anonymous users - sustained rate."""
    scope = 'anon_sustained'


class UserSustainedRateThrottle(UserRateThrottle):
    """Throttle for authenticated users - sustained rate."""
    scope = 'user_sustained'
