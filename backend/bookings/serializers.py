from rest_framework import serializers
from .models import Booking
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
            "total_amount",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "total_amount")

    def validate(self, attrs):
        if attrs["start_time"] >= attrs["end_time"]:
            raise serializers.ValidationError("End time must be after start time.")
        return attrs
