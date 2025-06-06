from django.shortcuts import render
from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from .models import Booking, BookingStatus
from .serializers import (
    BookingSerializer,
    BookingCreateSerializer,
    BookingStatusUpdateSerializer,
)
from utils.response import api_response


class BookingListAPIView(generics.ListAPIView):
    """List bookings with filtering and search."""

    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["status", "bike__id"]
    search_fields = ["bike__title", "bike__location"]
    ordering_fields = ["created_at", "start_time", "end_time"]
    ordering = ["-created_at"]

    def get_queryset(self):
        """Get bookings based on query parameters and user role."""
        user = self.request.user
        queryset = Booking.objects.select_related("bike", "renter").all()

        # Filter by role
        role = self.request.query_params.get("role")
        if role == "renter":
            # Bookings where current user is the renter
            queryset = queryset.filter(renter=user)
        elif role == "owner":
            # Bookings for bikes owned by current user
            queryset = queryset.filter(bike__owner=user)
        else:
            # Default: show all bookings related to the user (as renter or bike owner)
            queryset = queryset.filter(
                Q(renter=user) | Q(bike__owner=user)
            )

        # Filter by date range
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")
        if start_date:
            queryset = queryset.filter(start_time__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(end_time__date__lte=end_date)

        return queryset

    def list(self, request, *args, **kwargs):
        """Override list method to use custom response format."""
        queryset = self.filter_queryset(self.get_queryset())

        # Use pagination for requests without limit parameter
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(
            success=True,
            message="Bookings fetched successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def get_paginated_response(self, data):
        """Override to use custom response format even with pagination."""
        return api_response(
            success=True,
            message="Bookings fetched successfully",
            data={
                "results": data,
                "count": self.paginator.page.paginator.count,
                "next": self.paginator.get_next_link(),
                "previous": self.paginator.get_previous_link(),
            },
            status_code=status.HTTP_200_OK,
        )


class BookingCreateAPIView(generics.CreateAPIView):
    """Create a new booking (authenticated users only)."""

    serializer_class = BookingCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """Override create method to use custom response format."""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            booking = serializer.save()
            # Return full booking data using BookingSerializer
            response_serializer = BookingSerializer(booking, context={"request": request})
            return api_response(
                success=True,
                message="Booking created successfully",
                data=response_serializer.data,
                status_code=status.HTTP_201_CREATED,
            )
        return api_response(
            success=False,
            message="Invalid data",
            data=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST,
        )


class BookingDetailAPIView(generics.RetrieveAPIView):
    """Retrieve a specific booking."""

    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.select_related("bike", "renter").all()

    def get_object(self):
        """Ensure user can only access their own bookings (as renter or bike owner)."""
        booking = super().get_object()
        user = self.request.user
        
        if booking.renter != user and booking.bike.owner != user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You don't have permission to view this booking.")
        
        return booking

    def retrieve(self, request, *args, **kwargs):
        """Override retrieve method to use custom response format."""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Booking fetched successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )


class BookingStatusUpdateAPIView(generics.UpdateAPIView):
    """Update booking status."""

    serializer_class = BookingStatusUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.select_related("bike", "renter").all()

    def get_object(self):
        """Ensure user has permission to update booking status."""
        booking = super().get_object()
        user = self.request.user
        
        # Only renter or bike owner can update status
        if booking.renter != user and booking.bike.owner != user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You don't have permission to update this booking.")
        
        return booking

    def update(self, request, *args, **kwargs):
        """Override update method to use custom response format."""
        booking = self.get_object()
        serializer = self.get_serializer(booking, data=request.data, partial=True)
        
        if serializer.is_valid():
            updated_booking = serializer.save()
            # Return full booking data using BookingSerializer
            response_serializer = BookingSerializer(updated_booking, context={"request": request})
            return api_response(
                success=True,
                message="Booking status updated successfully",
                data=response_serializer.data,
                status_code=status.HTTP_200_OK,
            )
        
        return api_response(
            success=False,
            message="Invalid data",
            data=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST,
        )


class MyBookingsAPIView(generics.ListAPIView):
    """List bookings for the current user (as renter)."""

    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
    ]
    filterset_fields = ["status"]
    ordering_fields = ["created_at", "start_time", "end_time"]
    ordering = ["-created_at"]

    def get_queryset(self):
        """Get bookings where current user is the renter."""
        return Booking.objects.select_related("bike", "renter").filter(
            renter=self.request.user
        )

    def list(self, request, *args, **kwargs):
        """Override list method to use custom response format."""
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(
            success=True,
            message="Your bookings fetched successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def get_paginated_response(self, data):
        """Override to use custom response format even with pagination."""
        return api_response(
            success=True,
            message="Your bookings fetched successfully",
            data={
                "results": data,
                "count": self.paginator.page.paginator.count,
                "next": self.paginator.get_next_link(),
                "previous": self.paginator.get_previous_link(),
            },
            status_code=status.HTTP_200_OK,
        )


class BikeBookingsAPIView(generics.ListAPIView):
    """List bookings for bikes owned by the current user."""

    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
    ]
    filterset_fields = ["status"]
    ordering_fields = ["created_at", "start_time", "end_time"]
    ordering = ["-created_at"]

    def get_queryset(self):
        """Get bookings for bikes owned by current user."""
        return Booking.objects.select_related("bike", "renter").filter(
            bike__owner=self.request.user
        )

    def list(self, request, *args, **kwargs):
        """Override list method to use custom response format."""
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(
            success=True,
            message="Bike bookings fetched successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def get_paginated_response(self, data):
        """Override to use custom response format even with pagination."""
        return api_response(
            success=True,
            message="Bike bookings fetched successfully",
            data={
                "results": data,
                "count": self.paginator.page.paginator.count,
                "next": self.paginator.get_next_link(),
                "previous": self.paginator.get_previous_link(),
            },
            status_code=status.HTTP_200_OK,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_booking_api_view(request, pk):
    """Cancel a booking."""
    try:
        booking = Booking.objects.select_related("bike", "renter").get(pk=pk)
    except Booking.DoesNotExist:
        return api_response(
            success=False,
            message="Booking not found",
            data=None,
            status_code=status.HTTP_404_NOT_FOUND,
        )

    # Check permissions
    user = request.user
    if booking.renter != user and booking.bike.owner != user:
        return api_response(
            success=False,
            message="You don't have permission to cancel this booking",
            data=None,
            status_code=status.HTTP_403_FORBIDDEN,
        )

    # Check if booking can be cancelled
    if booking.status in [BookingStatus.COMPLETED, BookingStatus.CANCELLED]:
        return api_response(
            success=False,
            message=f"Cannot cancel booking with status: {booking.status}",
            data=None,
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    # Cancel the booking
    booking.status = BookingStatus.CANCELLED
    booking.save()

    # Return updated booking data
    serializer = BookingSerializer(booking, context={"request": request})
    return api_response(
        success=True,
        message="Booking cancelled successfully",
        data=serializer.data,
        status_code=status.HTTP_200_OK,
    )
