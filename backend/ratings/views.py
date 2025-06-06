from django.shortcuts import render
from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg, Count
from django.db import models

from .models import Rating
from .serializers import RatingSerializer, RatingCreateSerializer, RatingUpdateSerializer
from bookings.models import Booking, BookingStatus
from utils.response import api_response


class RatingListAPIView(generics.ListAPIView):
    """List all ratings with filtering and search."""

    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["rating", "bike__id", "user__id"]
    search_fields = ["comment", "bike__title", "user__first_name", "user__last_name"]
    ordering_fields = ["created_at", "rating"]
    ordering = ["-created_at"]

    def get_queryset(self):
        """Get ratings based on query parameters."""
        queryset = Rating.objects.select_related("bike", "user").all()

        # Filter by bike if requested
        bike_id = self.request.query_params.get("bike")
        if bike_id:
            queryset = queryset.filter(bike__id=bike_id)

        # Filter by user if requested
        user_id = self.request.query_params.get("user")
        if user_id:
            queryset = queryset.filter(user__id=user_id)

        # Filter by minimum rating
        min_rating = self.request.query_params.get("min_rating")
        if min_rating:
            queryset = queryset.filter(rating__gte=min_rating)

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
            message="Ratings fetched successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def get_paginated_response(self, data):
        """Override to use custom response format even with pagination."""
        return api_response(
            success=True,
            message="Ratings fetched successfully",
            data={
                "results": data,
                "count": self.paginator.page.paginator.count,
                "next": self.paginator.get_next_link(),
                "previous": self.paginator.get_previous_link(),
            },
            status_code=status.HTTP_200_OK,
        )


class RatingCreateAPIView(generics.CreateAPIView):
    """Create a new rating (authenticated users only)."""

    serializer_class = RatingCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """Override create method to use custom response format."""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            rating = serializer.save()
            # Return full rating data using RatingSerializer
            response_serializer = RatingSerializer(rating, context={"request": request})
            return api_response(
                success=True,
                message="Rating created successfully",
                data=response_serializer.data,
                status_code=status.HTTP_201_CREATED,
            )
        return api_response(
            success=False,
            message="Invalid data",
            data=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST,
        )


class RatingDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a rating."""

    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Rating.objects.select_related("bike", "user").all()

    def get_permissions(self):
        """Only the rating owner can update or delete their rating."""
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [IsAuthenticated()]
        return [permission() for permission in self.permission_classes]

    def retrieve(self, request, *args, **kwargs):
        """Override retrieve method to use custom response format."""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Rating fetched successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def update(self, request, *args, **kwargs):
        """Ensure only the rating owner can update their rating."""
        rating = self.get_object()
        if rating.user != request.user:
            return api_response(
                success=False,
                message="You can only update your own ratings.",
                data=None,
                status_code=status.HTTP_403_FORBIDDEN,
            )

        partial = kwargs.pop("partial", False)
        # Use RatingUpdateSerializer for updates (only allows rating and comment)
        serializer = RatingUpdateSerializer(rating, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Return full rating data using RatingSerializer
        response_serializer = RatingSerializer(rating, context={"request": request})
        return api_response(
            success=True,
            message="Rating updated successfully",
            data=response_serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        """Ensure only the rating owner can delete their rating."""
        rating = self.get_object()
        if rating.user != request.user:
            return api_response(
                success=False,
                message="You can only delete your own ratings.",
                data=None,
                status_code=status.HTTP_403_FORBIDDEN,
            )

        self.perform_destroy(rating)
        return api_response(
            success=True,
            message="Rating deleted successfully",
            data=None,
            status_code=status.HTTP_204_NO_CONTENT,
        )


class BikeRatingsAPIView(generics.ListAPIView):
    """List ratings for a specific bike."""

    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["created_at", "rating"]
    ordering = ["-created_at"]

    def get_queryset(self):
        bike_id = self.kwargs.get("bike_id")
        return Rating.objects.filter(bike__id=bike_id).select_related("bike", "user")

    def list(self, request, *args, **kwargs):
        """Override list method to use custom response format with statistics."""
        queryset = self.filter_queryset(self.get_queryset())
        
        # Calculate rating statistics
        stats = queryset.aggregate(
            average_rating=Avg('rating'),
            total_ratings=Count('id')
        )

        # Use pagination for requests without limit parameter
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data, stats)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(
            success=True,
            message="Bike ratings fetched successfully",
            data={
                "ratings": serializer.data,
                "statistics": {
                    "average_rating": round(stats['average_rating'], 2) if stats['average_rating'] else 0,
                    "total_ratings": stats['total_ratings']
                }
            },
            status_code=status.HTTP_200_OK,
        )

    def get_paginated_response(self, data, stats):
        """Override to use custom response format even with pagination."""
        return api_response(
            success=True,
            message="Bike ratings fetched successfully",
            data={
                "ratings": {
                    "results": data,
                    "count": self.paginator.page.paginator.count,
                    "next": self.paginator.get_next_link(),
                    "previous": self.paginator.get_previous_link(),
                },
                "statistics": {
                    "average_rating": round(stats['average_rating'], 2) if stats['average_rating'] else 0,
                    "total_ratings": stats['total_ratings']
                }
            },
            status_code=status.HTTP_200_OK,
        )


class MyRatingsAPIView(generics.ListAPIView):
    """List ratings created by the current user."""

    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
    ]
    filterset_fields = ["rating", "bike__id"]
    ordering_fields = ["created_at", "rating"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return Rating.objects.filter(user=self.request.user).select_related("bike", "user")

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
            message="Your ratings fetched successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def get_paginated_response(self, data):
        """Override to use custom response format even with pagination."""
        return api_response(
            success=True,
            message="Your ratings fetched successfully",
            data={
                "results": data,
                "count": self.paginator.page.paginator.count,
                "next": self.paginator.get_next_link(),
                "previous": self.paginator.get_previous_link(),
            },
            status_code=status.HTTP_200_OK,
        )


class RateableBookingsAPIView(generics.ListAPIView):
    """List completed bookings that can be rated by the current user."""

    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["created_at", "end_time"]
    ordering = ["-end_time"]

    def get_queryset(self):
        """Get completed bookings by current user that haven't been rated yet."""
        user = self.request.user
        return Booking.objects.filter(
            renter=user,
            status=BookingStatus.COMPLETED
        ).exclude(
            rating__isnull=False  # Exclude bookings that already have ratings
        ).select_related("bike")

    def list(self, request, *args, **kwargs):
        """Override list method to use custom response format."""
        queryset = self.filter_queryset(self.get_queryset())

        # Use pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            # Use BookingSerializer for the response
            from bookings.serializers import BookingSerializer
            serializer = BookingSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        from bookings.serializers import BookingSerializer
        serializer = BookingSerializer(queryset, many=True, context={"request": request})
        return api_response(
            success=True,
            message="Rateable bookings fetched successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def get_paginated_response(self, data):
        """Override to use custom response format even with pagination."""
        return api_response(
            success=True,
            message="Rateable bookings fetched successfully",
            data={
                "results": data,
                "count": self.paginator.page.paginator.count,
                "next": self.paginator.get_next_link(),
                "previous": self.paginator.get_previous_link(),
            },
            status_code=status.HTTP_200_OK,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def bike_rating_stats_api_view(request, bike_id):
    """Get rating statistics for a specific bike."""
    try:
        from bikes.models import Bike
        bike = Bike.objects.get(id=bike_id)
        
        ratings = Rating.objects.filter(bike=bike)
        stats = ratings.aggregate(
            average_rating=Avg('rating'),
            total_ratings=Count('id')
        )
        
        # Count ratings by star level
        rating_distribution = {}
        for i in range(1, 6):
            rating_distribution[f"{i}_star"] = ratings.filter(rating=i).count()
        
        return api_response(
            success=True,
            message="Bike rating statistics fetched successfully",
            data={
                "bike_id": bike_id,
                "bike_title": bike.title,
                "statistics": {
                    "average_rating": round(stats['average_rating'], 2) if stats['average_rating'] else 0,
                    "total_ratings": stats['total_ratings'],
                    "rating_distribution": rating_distribution
                }
            },
            status_code=status.HTTP_200_OK,
        )
    except Bike.DoesNotExist:
        return api_response(
            success=False,
            message="Bike not found",
            data=None,
            status_code=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        return api_response(
            success=False,
            message="An error occurred",
            data=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
