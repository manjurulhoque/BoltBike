from django.shortcuts import render
from rest_framework import serializers
from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import (
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
    AllowAny,
)
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from .models import Bike, BikeImage, MaintenanceTicket
from .serializers import (
    BikeSerializer,
    BikeImageSerializer,
    MaintenanceTicketSerializer,
)
from utils.response import api_response


class BikeListAPIView(generics.ListAPIView):
    """List all bikes with filtering and search."""

    serializer_class = BikeSerializer
    permission_classes = [AllowAny]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["status", "location"]
    search_fields = ["title", "description", "location"]
    ordering_fields = ["created_at", "hourly_rate", "daily_rate"]
    ordering = ["-created_at"]

    def get_queryset(self):
        """Get bikes based on query parameters."""
        queryset = Bike.objects.all()

        # Filter by owner if requested
        owner = self.request.query_params.get("owner")
        if owner == "me" and self.request.user.is_authenticated:
            queryset = queryset.filter(owner=self.request.user)
        elif owner and owner != "me":
            queryset = queryset.filter(owner__id=owner)

        # Filter by availability
        available_only = self.request.query_params.get("available_only")
        if available_only and available_only.lower() == "true":
            queryset = queryset.filter(status="available")

        # Filter by price range
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        if min_price:
            queryset = queryset.filter(daily_rate__gte=min_price)
        if max_price:
            queryset = queryset.filter(daily_rate__lte=max_price)

        return queryset

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
            message="Bikes fetched successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def get_paginated_response(self, data):
        """Override to use custom response format even with pagination."""
        return api_response(
            success=True,
            message="Bikes fetched successfully",
            data={
                "results": data,
                "count": self.paginator.page.paginator.count,
                "next": self.paginator.get_next_link(),
                "previous": self.paginator.get_previous_link(),
            },
            status_code=status.HTTP_200_OK,
        )


class BikeCreateAPIView(generics.CreateAPIView):
    """Create a new bike (authenticated users only)."""

    serializer_class = BikeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """Set the owner to the current user when creating a bike."""
        serializer.save(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        """Override create method to use custom response format."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return api_response(
            success=True,
            message="Bike created successfully",
            data=serializer.data,
            status_code=status.HTTP_201_CREATED,
        )


class BikeDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a bike."""

    serializer_class = BikeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Bike.objects.all()

    def get_permissions(self):
        """Only the owner can update or delete their bike."""
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [IsAuthenticated()]
        return [permission() for permission in self.permission_classes]

    def retrieve(self, request, *args, **kwargs):
        """Override retrieve method to use custom response format."""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Bike fetched successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def update(self, request, *args, **kwargs):
        """Ensure only the owner can update their bike."""
        bike = self.get_object()
        if bike.owner != request.user:
            return api_response(
                success=False,
                message="You can only update your own bikes.",
                data=None,
                status_code=status.HTTP_403_FORBIDDEN,
            )

        partial = kwargs.pop("partial", False)
        serializer = self.get_serializer(bike, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return api_response(
            success=True,
            message="Bike updated successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        """Ensure only the owner can delete their bike."""
        bike = self.get_object()
        if bike.owner != request.user:
            return api_response(
                success=False,
                message="You can only delete your own bikes.",
                data=None,
                status_code=status.HTTP_403_FORBIDDEN,
            )

        self.perform_destroy(bike)
        return api_response(
            success=True,
            message="Bike deleted successfully",
            data=None,
            status_code=status.HTTP_204_NO_CONTENT,
        )


class MyBikesAPIView(generics.ListAPIView):
    """List bikes owned by the current user."""

    serializer_class = BikeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Bike.objects.filter(owner=self.request.user)

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
            message="Your bikes fetched successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def get_paginated_response(self, data):
        """Override to use custom response format even with pagination."""
        return api_response(
            success=True,
            message="Your bikes fetched successfully",
            data={
                "results": data,
                "count": self.paginator.page.paginator.count,
                "next": self.paginator.get_next_link(),
                "previous": self.paginator.get_previous_link(),
            },
            status_code=status.HTTP_200_OK,
        )


class MaintenanceTicketListCreateAPIView(generics.ListCreateAPIView):
    """List maintenance tickets or create a new one."""

    serializer_class = MaintenanceTicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get maintenance tickets for bikes owned by the user or reported by the user."""
        return MaintenanceTicket.objects.filter(
            Q(bike__owner=self.request.user) | Q(reported_by=self.request.user)
        )

    def perform_create(self, serializer):
        """Set the reported_by to the current user."""
        serializer.save(reported_by=self.request.user)

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
            message="Maintenance tickets fetched successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def get_paginated_response(self, data):
        """Override to use custom response format even with pagination."""
        return api_response(
            success=True,
            message="Maintenance tickets fetched successfully",
            data={
                "results": data,
                "count": self.paginator.page.paginator.count,
                "next": self.paginator.get_next_link(),
                "previous": self.paginator.get_previous_link(),
            },
            status_code=status.HTTP_200_OK,
        )

    def create(self, request, *args, **kwargs):
        """Override create method to use custom response format."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return api_response(
            success=True,
            message="Maintenance ticket created successfully",
            data=serializer.data,
            status_code=status.HTTP_201_CREATED,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_bike_status_api_view(request, pk):
    """Toggle bike status between available and unavailable."""
    try:
        bike = Bike.objects.get(pk=pk, owner=request.user)
    except Bike.DoesNotExist:
        return api_response(
            success=False,
            message="Bike not found or you do not own this bike.",
            data=None,
            status_code=status.HTTP_404_NOT_FOUND,
        )

    if bike.status == "available":
        bike.status = "unavailable"
        message = "Bike status changed to unavailable"
    elif bike.status == "unavailable":
        bike.status = "available"
        message = "Bike status changed to available"
    else:
        return api_response(
            success=False,
            message="Cannot toggle bike status from maintenance mode",
            data=None,
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    bike.save()
    serializer = BikeSerializer(bike, context={"request": request})
    return api_response(
        success=True,
        message=message,
        data=serializer.data,
        status_code=status.HTTP_200_OK,
    )


class BikeImageListCreateAPIView(generics.ListCreateAPIView):
    """List or create bike images."""

    serializer_class = BikeImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        bike_id = self.kwargs["bike_id"]
        return BikeImage.objects.filter(bike_id=bike_id, bike__owner=self.request.user)

    def perform_create(self, serializer):
        bike_id = self.kwargs["bike_id"]
        try:
            bike = Bike.objects.get(id=bike_id, owner=self.request.user)
        except Bike.DoesNotExist:
            raise serializers.ValidationError(
                "Bike not found or you don't own this bike."
            )

        serializer.save(bike=bike)

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
            message="Bike images fetched successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def get_paginated_response(self, data):
        """Override to use custom response format even with pagination."""
        return api_response(
            success=True,
            message="Bike images fetched successfully",
            data={
                "results": data,
                "count": self.paginator.page.paginator.count,
                "next": self.paginator.get_next_link(),
                "previous": self.paginator.get_previous_link(),
            },
            status_code=status.HTTP_200_OK,
        )

    def create(self, request, *args, **kwargs):
        """Override create method to use custom response format."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return api_response(
            success=True,
            message="Bike image uploaded successfully",
            data=serializer.data,
            status_code=status.HTTP_201_CREATED,
        )


class BikeImageDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a bike image."""

    serializer_class = BikeImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BikeImage.objects.filter(bike__owner=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        """Override retrieve method to use custom response format."""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Bike image fetched successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def update(self, request, *args, **kwargs):
        """Override update method to use custom response format."""
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return api_response(
            success=True,
            message="Bike image updated successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        """Override destroy method to use custom response format."""
        instance = self.get_object()
        self.perform_destroy(instance)
        return api_response(
            success=True,
            message="Bike image deleted successfully",
            data=None,
            status_code=status.HTTP_204_NO_CONTENT,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def set_primary_image_api_view(request, bike_id, image_id):
    """Set an image as the primary image for a bike."""
    try:
        bike = Bike.objects.get(id=bike_id, owner=request.user)
        image = BikeImage.objects.get(id=image_id, bike=bike)
    except (Bike.DoesNotExist, BikeImage.DoesNotExist):
        return api_response(
            success=False,
            message="Bike or image not found.",
            data=None,
            status_code=status.HTTP_404_NOT_FOUND,
        )

    # Remove primary status from other images
    BikeImage.objects.filter(bike=bike).update(is_primary=False)

    # Set this image as primary
    image.is_primary = True
    image.save()

    serializer = BikeImageSerializer(image, context={"request": request})
    return api_response(
        success=True,
        message="Image set as primary successfully",
        data=serializer.data,
        status_code=status.HTTP_200_OK,
    )
