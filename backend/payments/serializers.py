from rest_framework import serializers
from .models import Payment
from bookings.serializers import BookingSerializer


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for the Payment model."""
    booking = BookingSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = (
            'id',
            'booking',
            'amount',
            'stripe_payment_id',
            'status',
            'created_at',
            'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'stripe_payment_id') 