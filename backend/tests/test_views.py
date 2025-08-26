"""
View tests for the e-bike rental platform API endpoints.
"""
import pytest
from decimal import Decimal
from datetime import datetime, timedelta
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from bikes.models import Bike, BikeStatus, BikeType
from bookings.models import Booking, BookingStatus
from users.models import User


@pytest.mark.views
@pytest.mark.api
class TestBikeViews:
    """Test cases for bike-related API views."""

    def test_list_bikes_authenticated(self, authenticated_user_client, multiple_bikes):
        """Test listing bikes for authenticated users."""
        url = reverse("bikes:bike-list")
        response = authenticated_user_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        # The response uses custom api_response format with data wrapper
        assert response.data["success"] is True
        assert "data" in response.data
        # Check if paginated (should be with 3 bikes)
        if "results" in response.data["data"]:
            assert len(response.data["data"]["results"]) == 3
            assert response.data["data"]["count"] == 3
        else:
            # If not paginated, check direct data
            assert len(response.data["data"]) == 3

    def test_list_bikes_unauthenticated(self, api_client, multiple_bikes):
        """Test listing bikes for unauthenticated users."""
        url = reverse("bikes:bike-list")
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_bike_owner(self, authenticated_owner_client, bike_data):
        """Test creating a bike as an owner."""
        url = reverse("bikes:bike-list")
        response = authenticated_owner_client.post(url, bike_data, format="json")
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["title"] == bike_data["title"]
        assert response.data["owner"] == authenticated_owner_client.handler._force_user.id

    def test_create_bike_non_owner(self, authenticated_user_client, bike_data):
        """Test that non-owners cannot create bikes."""
        url = reverse("bikes:bike-list")
        response = authenticated_user_client.post(url, bike_data, format="json")
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_retrieve_bike(self, authenticated_user_client, bike):
        """Test retrieving a specific bike."""
        url = reverse("bikes:bike-detail", kwargs={"pk": bike.pk})
        response = authenticated_user_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == bike.id
        assert response.data["title"] == bike.title

    def test_update_bike_owner(self, authenticated_owner_client, bike):
        """Test updating a bike as the owner."""
        url = reverse("bikes:bike-detail", kwargs={"pk": bike.pk})
        update_data = {"title": "Updated Bike Title"}
        response = authenticated_owner_client.patch(url, update_data, format="json")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == "Updated Bike Title"

    def test_update_bike_non_owner(self, authenticated_user_client, bike):
        """Test that non-owners cannot update bikes."""
        url = reverse("bikes:bike-detail", kwargs={"pk": bike.pk})
        update_data = {"title": "Updated Bike Title"}
        response = authenticated_user_client.patch(url, update_data, format="json")
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_delete_bike_owner(self, authenticated_owner_client, bike):
        """Test deleting a bike as the owner."""
        url = reverse("bikes:bike-detail", kwargs={"pk": bike.pk})
        response = authenticated_owner_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_delete_bike_non_owner(self, authenticated_user_client, bike):
        """Test that non-owners cannot delete bikes."""
        url = reverse("bikes:bike-detail", kwargs={"pk": bike.pk})
        response = authenticated_user_client.delete(url)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_my_bikes_endpoint(self, authenticated_owner_client, bike):
        """Test the my-bikes endpoint for bike owners."""
        url = reverse("bikes:my-bikes")
        response = authenticated_owner_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["id"] == bike.id

    def test_toggle_bike_status(self, authenticated_owner_client, bike):
        """Test toggling bike availability status."""
        url = reverse("bikes:toggle-status", kwargs={"pk": bike.pk})
        response = authenticated_owner_client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        bike.refresh_from_db()
        assert bike.status == BikeStatus.UNAVAILABLE

    def test_bike_filtering_by_type(self, authenticated_user_client, multiple_bikes):
        """Test filtering bikes by bike type."""
        url = reverse("bikes:bike-list")
        response = authenticated_user_client.get(url, {"bike_type": "city"})
        
        assert response.status_code == status.HTTP_200_OK
        assert all(bike["bike_type"] == "city" for bike in response.data["results"])

    def test_bike_search(self, authenticated_user_client, multiple_bikes):
        """Test searching bikes by title or description."""
        url = reverse("bikes:bike-list")
        response = authenticated_user_client.get(url, {"search": "City"})
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) > 0


@pytest.mark.views
@pytest.mark.api
class TestUserViews:
    """Test cases for user-related API views."""

    def test_user_registration(self, api_client, user_data):
        """Test user registration endpoint."""
        url = reverse("users:register")
        response = api_client.post(url, user_data, format="json")
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["email"] == user_data["email"]
        assert response.data["first_name"] == user_data["first_name"]

    def test_user_login(self, api_client, user):
        """Test user login endpoint."""
        url = reverse("users:login")
        login_data = {
            "email": user.email,
            "password": "testpass123"
        }
        response = api_client.post(url, login_data, format="json")
        
        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data
        assert "refresh" in response.data

    def test_user_profile(self, authenticated_user_client, user):
        """Test retrieving user profile."""
        url = reverse("users:profile")
        response = authenticated_user_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data["email"] == user.email
        assert response.data["first_name"] == user.first_name

    def test_update_user_profile(self, authenticated_user_client, user):
        """Test updating user profile."""
        url = reverse("users:profile")
        update_data = {"first_name": "Updated Name"}
        response = authenticated_user_client.patch(url, update_data, format="json")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data["first_name"] == "Updated Name"

    def test_change_password(self, authenticated_user_client, user):
        """Test changing user password."""
        url = reverse("users:change-password")
        password_data = {
            "old_password": "testpass123",
            "new_password": "newpass123"
        }
        response = authenticated_user_client.post(url, password_data, format="json")
        
        assert response.status_code == status.HTTP_200_OK
        user.refresh_from_db()
        assert user.check_password("newpass123")


@pytest.mark.views
@pytest.mark.api
class TestBookingViews:
    """Test cases for booking-related API views."""

    def test_create_booking(self, authenticated_user_client, bike):
        """Test creating a booking."""
        url = reverse("bookings:booking-list")
        from django.utils import timezone
        start_time = timezone.now() + timedelta(days=1)
        end_time = start_time + timedelta(hours=4)
        
        booking_data = {
            "bike": bike.id,
            "start_time": start_time.isoformat(),
            "end_time": end_time.isoformat(),
        }
        
        response = authenticated_user_client.post(url, booking_data, format="json")
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["bike"] == bike.id
        assert response.data["status"] == BookingStatus.REQUESTED

    def test_create_booking_past_time(self, authenticated_user_client, bike):
        """Test that booking with past time is rejected."""
        url = reverse("bookings:booking-list")
        from django.utils import timezone
        start_time = timezone.now() - timedelta(hours=1)
        end_time = start_time + timedelta(hours=2)
        
        booking_data = {
            "bike": bike.id,
            "start_time": start_time.isoformat(),
            "end_time": end_time.isoformat(),
        }
        
        response = authenticated_user_client.post(url, booking_data, format="json")
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_list_user_bookings(self, authenticated_user_client, booking):
        """Test listing user's bookings."""
        url = reverse("bookings:my-bookings")
        response = authenticated_user_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["id"] == booking.id

    def test_approve_booking_owner(self, authenticated_owner_client, booking):
        """Test approving a booking as the bike owner."""
        url = reverse("bookings:approve-booking", kwargs={"pk": booking.pk})
        response = authenticated_owner_client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        booking.refresh_from_db()
        assert booking.status == BookingStatus.APPROVED

    def test_approve_booking_non_owner(self, authenticated_user_client, booking):
        """Test that non-owners cannot approve bookings."""
        url = reverse("bookings:approve-booking", kwargs={"pk": booking.pk})
        response = authenticated_user_client.post(url)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_cancel_booking_renter(self, authenticated_user_client, booking):
        """Test cancelling a booking as the renter."""
        url = reverse("bookings:cancel-booking", kwargs={"pk": booking.pk})
        response = authenticated_user_client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        booking.refresh_from_db()
        assert booking.status == BookingStatus.CANCELLED

    def test_cancel_booking_non_renter(self, authenticated_owner_client, booking):
        """Test that non-renters cannot cancel bookings."""
        url = reverse("bookings:cancel-booking", kwargs={"pk": booking.pk})
        response = authenticated_owner_client.post(url)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.views
@pytest.mark.integration
class TestViewIntegration:
    """Test cases for view integration and complex scenarios."""

    def test_bike_booking_workflow(self, authenticated_user_client, authenticated_owner_client, bike):
        """Test complete bike booking workflow."""
        # 1. User creates booking
        from django.utils import timezone
        start_time = timezone.now() + timedelta(days=1)
        end_time = start_time + timedelta(hours=4)
        
        booking_data = {
            "bike": bike.id,
            "start_time": start_time.isoformat(),
            "end_time": end_time.isoformat(),
        }
        
        create_response = authenticated_user_client.post(
            reverse("bookings:booking-list"), 
            booking_data, 
            format="json"
        )
        assert create_response.status_code == status.HTTP_201_CREATED
        
        booking_id = create_response.data["id"]
        
        # 2. Owner approves booking
        approve_response = authenticated_owner_client.post(
            reverse("bookings:approve-booking", kwargs={"pk": booking_id})
        )
        assert approve_response.status_code == status.HTTP_200_OK
        
        # 3. Verify booking status changed
        from bookings.models import Booking
        booking = Booking.objects.get(id=booking_id)
        assert booking.status == BookingStatus.APPROVED

    def test_bike_availability_after_booking(self, authenticated_user_client, bike):
        """Test that bike becomes unavailable after booking."""
        # Create a booking
        from django.utils import timezone
        start_time = timezone.now() + timedelta(days=1)
        end_time = start_time + timedelta(hours=4)
        
        booking_data = {
            "bike": bike.id,
            "start_time": start_time.isoformat(),
            "end_time": end_time.isoformat(),
        }
        
        response = authenticated_user_client.post(
            reverse("bookings:booking-list"), 
            booking_data, 
            format="json"
        )
        assert response.status_code == status.HTTP_201_CREATED
        
        # Check that bike is still available (pending approval)
        bike.refresh_from_db()
        assert bike.status == BikeStatus.AVAILABLE
