"""
Pytest configuration and fixtures for the e-bike rental platform.
"""

import pytest
from decimal import Decimal
from datetime import timedelta
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient

from bikes.models import Bike, BikeImage, BikeType, BikeStatus
from bookings.models import Booking, BookingStatus
from users.models import User

User = get_user_model()


@pytest.fixture
def api_client():
    """Return an unauthenticated API client."""
    return APIClient()


@pytest.fixture
def authenticated_client():
    """Return an authenticated API client."""
    client = APIClient()
    return client


@pytest.fixture
def user_data():
    """Sample user data for testing."""
    return {
        "email": "test@example.com",
        "password": "testpass123",
        "first_name": "Test",
        "last_name": "User",
        "phone": "+1234567890",
        "is_owner": False,
        "is_renter": True,
    }


@pytest.fixture
def owner_data():
    """Sample bike owner data for testing."""
    return {
        "email": "owner@example.com",
        "password": "ownerpass123",
        "first_name": "Bike",
        "last_name": "Owner",
        "phone": "+1234567891",
        "is_owner": True,
        "is_renter": False,
    }


@pytest.fixture
def user(db, user_data):
    """Create and return a test user."""
    user = User.objects.create_user(
        email=user_data["email"],
        password=user_data["password"],
        first_name=user_data["first_name"],
        last_name=user_data["last_name"],
        phone=user_data["phone"],
        is_owner=user_data["is_owner"],
        is_renter=user_data["is_renter"],
    )
    return user


@pytest.fixture
def owner(db, owner_data):
    """Create and return a test bike owner."""
    owner = User.objects.create_user(
        email=owner_data["email"],
        password=owner_data["password"],
        first_name=owner_data["first_name"],
        last_name=owner_data["last_name"],
        phone=owner_data["phone"],
        is_owner=owner_data["is_owner"],
        is_renter=owner_data["is_renter"],
    )
    return owner


@pytest.fixture
def authenticated_user_client(api_client, user):
    """Return an authenticated API client for a regular user."""
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def authenticated_owner_client(api_client, owner):
    """Return an authenticated API client for a bike owner."""
    api_client.force_authenticate(user=owner)
    return api_client


@pytest.fixture
def bike_data():
    """Sample bike data for testing."""
    return {
        "title": "Test E-Bike",
        "description": "A great test e-bike for testing purposes",
        "location": "Test City, Test State",
        "hourly_rate": Decimal("15.00"),
        "daily_rate": Decimal("80.00"),
        "bike_type": BikeType.CITY,
        "battery_range": 50,
        "max_speed": 25,
        "weight": Decimal("22.5"),
        "features": ["LED lights", "Basket", "Phone holder"],
        "status": BikeStatus.AVAILABLE,
    }


@pytest.fixture
def bike(db, owner, bike_data):
    """Create and return a test bike."""
    bike = Bike.objects.create(owner=owner, **bike_data)
    return bike


@pytest.fixture
def bike_factory(db, owner, bike_data):
    """Create a test bike factory."""

    def create_bike(**kwargs):
        data = bike_data.copy()
        data.update(kwargs)
        bike = Bike.objects.create(owner=owner, **data)
        return bike

    return create_bike


@pytest.fixture
def bike_image_data():
    """Sample bike image data for testing."""
    return {
        "alt_text": "Test bike image",
        "caption": "A beautiful test e-bike",
        "is_primary": True,
        "order": 0,
    }


@pytest.fixture
def bike_image(db, bike, bike_image_data):
    """Create and return a test bike image."""
    # Create a simple test image file
    image_content = b"fake-image-content"
    image_file = SimpleUploadedFile(
        "test_bike.jpg", image_content, content_type="image/jpeg"
    )

    bike_image = BikeImage.objects.create(
        bike=bike, image=image_file, **bike_image_data
    )
    return bike_image


@pytest.fixture
def booking_data():
    """Sample booking data for testing."""
    from django.utils import timezone

    start_time = timezone.now() + timedelta(days=1)
    end_time = start_time + timedelta(hours=4)

    return {
        "start_time": start_time,
        "end_time": end_time,
        "total_price": Decimal("60.00"),
        "status": BookingStatus.REQUESTED,
    }


@pytest.fixture
def booking(db, bike, user, booking_data):
    """Create and return a test booking."""
    booking = Booking.objects.create(bike=bike, renter=user, **booking_data)
    return booking


@pytest.fixture
def multiple_bikes(db, owner):
    """Create multiple test bikes for testing."""
    bikes = []
    bike_types = [BikeType.CITY, BikeType.MOUNTAIN, BikeType.ROAD]

    for i, bike_type in enumerate(bike_types):
        bike = Bike.objects.create(
            owner=owner,
            title=f"Test {bike_type.title()} Bike {i+1}",
            description=f"A great {bike_type} e-bike for testing",
            location=f"Test City {i+1}, Test State",
            hourly_rate=Decimal(f"{15 + i*5}.00"),
            daily_rate=Decimal(f"{80 + i*20}.00"),
            bike_type=bike_type,
            battery_range=50 + i * 10,
            max_speed=25 + i * 5,
            weight=Decimal("22.5") + i,
            features=[f"Feature {i+1}", f"Feature {i+2}"],
            status=BikeStatus.AVAILABLE,
        )
        bikes.append(bike)

    return bikes


@pytest.fixture
def multiple_users(db):
    """Create multiple test users for testing."""
    users = []
    for i in range(3):
        user = User.objects.create_user(
            email=f"user{i+1}@example.com",
            password=f"pass{i+1}",
            first_name=f"User{i+1}",
            last_name=f"Test{i+1}",
            phone=f"+123456789{i}",
            is_owner=i == 0,  # First user is owner
            is_renter=True,
        )
        users.append(user)

    return users


@pytest.fixture
def sample_image_file():
    """Return a sample image file for testing."""
    image_content = b"fake-image-content-for-testing"
    return SimpleUploadedFile(
        "sample_image.jpg", image_content, content_type="image/jpeg"
    )


@pytest.fixture
def sample_profile_image():
    """Return a sample profile image file for testing."""
    image_content = b"fake-profile-image-content"
    return SimpleUploadedFile("profile.jpg", image_content, content_type="image/jpeg")


# Database transaction fixtures
@pytest.fixture(scope="function")
def db_transaction():
    """Ensure each test runs in a transaction."""
    pass


# Performance testing fixtures
@pytest.fixture
def large_dataset(db, owner):
    """Create a large dataset for performance testing."""
    bikes = []
    for i in range(100):
        bike = Bike.objects.create(
            owner=owner,
            title=f"Performance Test Bike {i+1}",
            description=f"Performance test bike number {i+1}",
            location=f"Test Location {i+1}",
            hourly_rate=Decimal(f"{10 + (i % 20)}.00"),
            daily_rate=Decimal(f"{50 + (i % 50)}.00"),
            bike_type=BikeType.CITY if i % 3 == 0 else BikeType.MOUNTAIN,
            battery_range=30 + (i % 40),
            max_speed=20 + (i % 15),
            weight=Decimal(f"{20 + (i % 10)}.0"),
            features=[f"Feature {i+1}"],
            status=BikeStatus.AVAILABLE,
        )
        bikes.append(bike)

    return bikes


# Cleanup fixtures
@pytest.fixture(autouse=True)
def cleanup_files():
    """Clean up uploaded files after tests."""
    yield
    # Cleanup logic can be added here if needed
