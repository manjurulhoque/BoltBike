"""
Basic tests to verify pytest setup is working correctly.
"""
import pytest
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


@pytest.mark.unit
class TestBasicSetup:
    """Basic tests to verify the testing environment is working."""

    def test_pytest_is_working(self):
        """Test that pytest is working correctly."""
        assert True
        assert 1 + 1 == 2

    def test_django_imports_work(self):
        """Test that Django imports are working."""
        from django.conf import settings
        assert settings.DEBUG is not None

    def test_rest_framework_imports_work(self):
        """Test that DRF imports are working."""
        from rest_framework import status
        assert status.HTTP_200_OK == 200


@pytest.mark.unit
class TestDatabaseConnection:
    """Test that database connection is working."""

    def test_database_connection(self, db):
        """Test that we can connect to the database."""
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            assert result[0] == 1

    def test_can_create_user(self, db):
        """Test that we can create a user in the database."""
        from users.models import User
        user = User.objects.create_user(
            email="test@example.com",
            password="testpass123",
            first_name="Test",
            last_name="User"
        )
        assert user.email == "test@example.com"
        assert user.check_password("testpass123")


@pytest.mark.unit
class TestFixtures:
    """Test that fixtures are working correctly."""

    def test_user_fixture(self, user):
        """Test that the user fixture works."""
        assert user.email == "test@example.com"
        assert user.first_name == "Test"
        assert user.last_name == "User"

    def test_owner_fixture(self, owner):
        """Test that the owner fixture works."""
        assert owner.email == "owner@example.com"
        assert owner.is_owner is True
        assert owner.is_renter is False

    def test_bike_fixture(self, bike, owner):
        """Test that the bike fixture works."""
        assert bike.owner == owner
        assert bike.title == "Test E-Bike"
        assert bike.status == "available"

    def test_booking_fixture(self, booking, bike, user):
        """Test that the booking fixture works."""
        assert booking.bike == bike
        assert booking.renter == user
        assert booking.status == "requested"


@pytest.mark.unit
class TestAPIClient:
    """Test that API client fixtures work."""

    def test_api_client_fixture(self, api_client):
        """Test that the API client fixture works."""
        assert isinstance(api_client, APIClient)

    def test_authenticated_user_client_fixture(self, authenticated_user_client, user):
        """Test that authenticated user client works."""
        assert authenticated_user_client.handler._force_user == user

    def test_authenticated_owner_client_fixture(self, authenticated_owner_client, owner):
        """Test that authenticated owner client works."""
        assert authenticated_owner_client.handler._force_user == owner


@pytest.mark.unit
class TestModelImports:
    """Test that all model imports work correctly."""

    def test_user_model_import(self):
        """Test that User model can be imported."""
        from users.models import User
        assert User is not None

    def test_bike_model_import(self):
        """Test that Bike model can be imported."""
        from bikes.models import Bike, BikeType, BikeStatus
        assert Bike is not None
        assert BikeType is not None
        assert BikeStatus is not None

    def test_booking_model_import(self):
        """Test that Booking model can be imported."""
        from bookings.models import Booking, BookingStatus
        assert Booking is not None
        assert BookingStatus is not None


@pytest.mark.unit
class TestURLPatterns:
    """Test that URL patterns are working."""

    def test_users_urls(self):
        """Test that users URLs can be resolved."""
        try:
            reverse("users:signup")
            reverse("users:login")
            reverse("users:me")
            assert True
        except Exception as e:
            pytest.fail(f"Failed to resolve users URLs: {e}")

    def test_bikes_urls(self):
        """Test that bikes URLs can be resolved."""
        try:
            reverse("bikes:bike-list")
            reverse("bikes:my-bikes")
            assert True
        except Exception as e:
            pytest.fail(f"Failed to resolve bikes URLs: {e}")

    def test_bookings_urls(self):
        """Test that bookings URLs can be resolved."""
        try:
            reverse("bookings:booking-list")
            reverse("bookings:my-bookings")
            assert True
        except Exception as e:
            pytest.fail(f"Failed to resolve bookings URLs: {e}")


@pytest.mark.unit
class TestSettings:
    """Test that Django settings are configured correctly."""

    def test_debug_setting(self):
        """Test that DEBUG setting is accessible."""
        from django.conf import settings
        assert hasattr(settings, 'DEBUG')

    def test_database_setting(self):
        """Test that database settings are configured."""
        from django.conf import settings
        assert hasattr(settings, 'DATABASES')
        assert 'default' in settings.DATABASES

    def test_installed_apps(self):
        """Test that required apps are installed."""
        from django.conf import settings
        required_apps = ['users', 'bikes', 'bookings', 'core']
        for app in required_apps:
            assert app in settings.INSTALLED_APPS


if __name__ == "__main__":
    pytest.main([__file__])
