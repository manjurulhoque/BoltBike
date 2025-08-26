"""
Model tests for the e-bike rental platform.
"""
import pytest
from decimal import Decimal
from django.db import IntegrityError

from users.models import User
from bikes.models import Bike, BikeType, BikeStatus


@pytest.mark.models
@pytest.mark.user
@pytest.mark.django_db
class TestUserModel:
    """Test cases for the User model."""

    def test_create_user(self, user_data):
        """Test creating a regular user."""
        user = User.objects.create_user(**user_data)
        assert user.email == user_data["email"]
        assert user.first_name == user_data["first_name"]
        assert user.last_name == user_data["last_name"]
        assert user.is_owner == user_data["is_owner"]
        assert user.is_renter == user_data["is_renter"]
        assert user.check_password(user_data["password"])

    def test_create_superuser(self, user_data):
        """Test creating a superuser."""
        user_data["is_staff"] = True
        user_data["is_superuser"] = True
        user = User.objects.create_superuser(**user_data)
        assert user.is_staff
        assert user.is_superuser

    def test_user_str_representation(self, user):
        """Test user string representation."""
        expected = f"{user.first_name} {user.last_name}"
        assert str(user) == expected

    def test_user_full_name(self, user):
        """Test user full name property."""
        expected = f"{user.first_name} {user.last_name}"
        assert user.get_full_name() == expected

    def test_user_short_name(self, user):
        """Test user short name property."""
        assert user.get_short_name() == user.first_name

    def test_user_required_fields(self):
        """Test that required fields are enforced."""
        with pytest.raises(ValueError):
            User.objects.create_user(email="")

        # with pytest.raises(ValueError):
        #     User.objects.create_user(email="test@example.com", password="")
        
        # Test that first_name and last_name are not required
        user = User.objects.create_user(
            email="test2@example.com",
            password="testpass123"
        )
        assert user.email == "test2@example.com"
        assert user.first_name == ""
        assert user.last_name == ""

    def test_user_unique_email(self, user_data):
        """Test that email must be unique."""
        User.objects.create_user(**user_data)
        with pytest.raises(IntegrityError):
            User.objects.create_user(**user_data)

    def test_user_default_values(self, user_data):
        """Test user default values."""
        user = User.objects.create_user(**user_data)
        assert user.is_active
        assert not user.is_staff
        assert not user.is_superuser


@pytest.mark.models
@pytest.mark.bike
class TestBikeModel:
    """Test cases for the Bike model."""

    def test_create_bike(self, bike, owner):
        """Test creating a bike."""
        assert bike.owner == owner
        assert bike.title == "Test E-Bike"
        assert bike.bike_type == BikeType.CITY
        assert bike.status == BikeStatus.AVAILABLE
        assert bike.battery_range == 50
        assert bike.max_speed == 25
        assert bike.weight == Decimal("22.5")

    def test_bike_str_representation(self, bike):
        """Test bike string representation."""
        expected = f"{bike.title} - {bike.owner.get_full_name()}"
        assert str(bike) == expected

    def test_bike_ordering(self, multiple_bikes):
        """Test bike ordering by creation date."""
        bikes = list(Bike.objects.all())
        assert bikes[0].created_at >= bikes[1].created_at

    def test_bike_type_choices(self):
        """Test bike type choices."""
        choices = [choice[0] for choice in BikeType.choices]
        expected_choices = ["city", "mountain", "road", "cargo", "folding", "hybrid"]
        assert choices == expected_choices

    def test_bike_status_choices(self):
        """Test bike status choices."""
        choices = [choice[0] for choice in BikeStatus.choices]
        expected_choices = ["available", "unavailable", "maintenance"]
        assert choices == expected_choices

    def test_bike_features_json_field(self, bike):
        """Test bike features JSON field."""
        expected_features = ["LED lights", "Basket", "Phone holder"]
        assert bike.features == expected_features

    def test_bike_decimal_fields(self, bike):
        """Test bike decimal field precision."""
        assert bike.hourly_rate == Decimal("15.00")
        assert bike.daily_rate == Decimal("80.00")
        assert bike.weight == Decimal("22.5")

    def test_bike_positive_integer_fields(self, bike):
        """Test bike positive integer field constraints."""
        assert bike.battery_range > 0
        assert bike.max_speed > 0

    def test_bike_owner_relationship(self, bike, owner):
        """Test bike owner relationship."""
        assert bike.owner == owner
        assert bike in owner.bikes.all()
