import math


def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great-circle distance between two points on Earth
    using the Haversine formula.

    Args:
        lat1, lon1: Coordinates of point 1 (in degrees).
        lat2, lon2: Coordinates of point 2 (in degrees).

    Returns:
        Distance in kilometers.
    """
    R = 6371  # Earth's radius in kilometers

    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)

    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(d_lon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


def is_duplicate(
    lat1: float, lon1: float, lat2: float, lon2: float, threshold_km: float = 0.1
) -> bool:
    """
    Check if two locations are within a given threshold distance (default: 100 meters).

    Args:
        lat1, lon1: Coordinates of the new issue.
        lat2, lon2: Coordinates of the existing issue.
        threshold_km: Maximum distance in km to consider as duplicate.

    Returns:
        True if the two points are within the threshold distance.
    """
    distance = haversine(lat1, lon1, lat2, lon2)
    return distance <= threshold_km
