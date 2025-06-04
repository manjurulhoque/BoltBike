from rest_framework import serializers
from .models import Rating
from bookings.serializers import BookingSerializer
from users.serializers import UserSerializer


class RatingSerializer(serializers.ModelSerializer):
    """Serializer for the Rating model."""

    booking = BookingSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Rating
        fields = ("id", "booking", "user", "rating", "comment", "created_at")
        read_only_fields = ("id", "created_at")

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value
