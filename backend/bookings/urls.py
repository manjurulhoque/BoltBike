from django.urls import path

from .views import (
    BookingListAPIView,
    BookingCreateAPIView,
    BookingDetailAPIView,
    BookingStatusUpdateAPIView,
    MyBookingsAPIView,
    BikeBookingsAPIView,
    cancel_booking_api_view,
)

app_name = "bookings"

urlpatterns = [
    path("", BookingListAPIView.as_view(), name="booking-list"),
    path("create/", BookingCreateAPIView.as_view(), name="booking-create"),
    path("<int:pk>/", BookingDetailAPIView.as_view(), name="booking-detail"),
    path(
        "<int:pk>/update-status/",
        BookingStatusUpdateAPIView.as_view(),
        name="booking-status-update",
    ),
    path(
        "<int:pk>/cancel/",
        cancel_booking_api_view,
        name="booking-cancel",
    ),
    path("my-bookings/", MyBookingsAPIView.as_view(), name="my-bookings"),
    path("bike-bookings/", BikeBookingsAPIView.as_view(), name="bike-bookings"),
] 