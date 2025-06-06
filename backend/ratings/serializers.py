from rest_framework import serializers
from .models import Rating
from bikes.serializers import BikeSerializer
from users.serializers import UserSerializer
from bookings.serializers import BookingSerializer
from bookings.models import Booking, BookingStatus


class RatingSerializer(serializers.ModelSerializer):
    """Serializer for the Rating model."""

    bike = BikeSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    booking = BookingSerializer(read_only=True)

    class Meta:
        model = Rating
        fields = ("id", "bike", "user", "booking", "rating", "comment", "created_at")
        read_only_fields = ("id", "created_at")

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value


class RatingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating ratings."""

    class Meta:
        model = Rating
        fields = ("booking", "rating", "comment")

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def validate_booking(self, value):
        """Validate that the booking is valid for rating."""
        user = self.context['request'].user
        
        # Check if booking exists and user is the renter
        if value.renter != user:
            raise serializers.ValidationError("You can only rate bookings you have made.")
        
        # Check if booking is completed
        if value.status != BookingStatus.COMPLETED:
            raise serializers.ValidationError("You can only rate completed bookings.")
        
        # Check if rating already exists for this booking
        if hasattr(value, 'rating'):
            raise serializers.ValidationError("You have already rated this booking.")
        
        return value

    def create(self, validated_data):
        """Create rating with current user and derived bike."""
        user = self.context['request'].user
        booking = validated_data['booking']
        
        validated_data['user'] = user
        validated_data['bike'] = booking.bike
        
        return super().create(validated_data)


class RatingUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating ratings (only rating and comment can be updated)."""

    class Meta:
        model = Rating
        fields = ("rating", "comment")

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value
