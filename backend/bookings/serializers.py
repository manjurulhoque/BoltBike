from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from .models import Booking, BookingStatus
from users.serializers import UserSerializer
from bikes.serializers import BikeSerializer


class BookingSerializer(serializers.ModelSerializer):
    """Serializer for the Booking model."""

    renter = UserSerializer(read_only=True)
    bike = BikeSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = (
            "id",
            "renter",
            "bike",
            "start_time",
            "end_time",
            "status",
            "total_price",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "total_price")

    def validate(self, attrs):
        if attrs["start_time"] >= attrs["end_time"]:
            raise serializers.ValidationError("End time must be after start time.")
        return attrs


class BookingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new bookings."""

    bike_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Booking
        fields = (
            "bike_id",
            "start_time",
            "end_time",
        )

    def validate(self, attrs):
        # Validate start and end times
        if attrs["start_time"] >= attrs["end_time"]:
            raise serializers.ValidationError("End time must be after start time.")
        
        # Validate start time is not in the past
        if attrs["start_time"] < timezone.now():
            raise serializers.ValidationError("Start time cannot be in the past.")
        
        # Validate minimum booking duration (1 hour)
        min_duration = timedelta(hours=1)
        if attrs["end_time"] - attrs["start_time"] < min_duration:
            raise serializers.ValidationError("Minimum booking duration is 1 hour.")
        
        # Check for conflicting bookings
        bike_id = attrs.get("bike_id")
        if bike_id:
            from django.db.models import Q
            conflicting_bookings = Booking.objects.filter(
                bike_id=bike_id,
                status__in=[BookingStatus.APPROVED, BookingStatus.ACTIVE],
            ).filter(
                Q(start_time__lt=attrs["end_time"]) & Q(end_time__gt=attrs["start_time"])
            )
            
            if conflicting_bookings.exists():
                raise serializers.ValidationError(
                    "This bike is already booked for the selected time period."
                )
        
        return attrs

    def validate_bike_id(self, value):
        """Validate bike exists and is available."""
        from bikes.models import Bike
        
        try:
            bike = Bike.objects.get(id=value)
        except Bike.DoesNotExist:
            raise serializers.ValidationError("Bike not found.")
        
        if bike.status != "available":
            raise serializers.ValidationError("Bike is not available for booking.")
        
        # Prevent users from booking their own bikes
        if hasattr(self, 'context') and 'request' in self.context:
            request_user = self.context['request'].user
            if bike.owner == request_user:
                raise serializers.ValidationError("You cannot book your own bike.")
        
        return value

    def create(self, validated_data):
        """Create a new booking with calculated total price."""
        from bikes.models import Bike
        
        bike_id = validated_data.pop("bike_id")
        bike = Bike.objects.get(id=bike_id)
        
        # Calculate total price based on duration
        duration = validated_data["end_time"] - validated_data["start_time"]
        hours = duration.total_seconds() / 3600
        
        # Use daily rate if booking is for 24+ hours, otherwise hourly rate
        if hours >= 24:
            days = hours / 24
            total_price = days * bike.daily_rate
        else:
            total_price = hours * bike.hourly_rate
        
        # Create booking
        booking = Booking.objects.create(
            bike=bike,
            renter=self.context["request"].user,
            total_price=round(total_price, 2),
            **validated_data
        )
        
        return booking


class BookingStatusUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating booking status."""

    class Meta:
        model = Booking
        fields = ("status",)

    def validate_status(self, value):
        """Validate status transitions."""
        current_status = self.instance.status if self.instance else None
        
        # Define allowed status transitions
        allowed_transitions = {
            BookingStatus.REQUESTED: [BookingStatus.APPROVED, BookingStatus.CANCELLED],
            BookingStatus.APPROVED: [BookingStatus.ACTIVE, BookingStatus.CANCELLED],
            BookingStatus.ACTIVE: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
            BookingStatus.COMPLETED: [],  # No transitions allowed from completed
            BookingStatus.CANCELLED: [],  # No transitions allowed from cancelled
        }
        
        if current_status and value not in allowed_transitions.get(current_status, []):
            raise serializers.ValidationError(
                f"Cannot change status from {current_status} to {value}."
            )
        
        return value
