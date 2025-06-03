from rest_framework import serializers
from .models import Bike, MaintenanceTicket
from users.serializers import UserSerializer


class BikeSerializer(serializers.ModelSerializer):
    """Serializer for the Bike model."""
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Bike
        fields = (
            'id',
            'owner',
            'title',
            'description',
            'location',
            'hourly_rate',
            'daily_rate',
            'status',
            'created_at',
            'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class MaintenanceTicketSerializer(serializers.ModelSerializer):
    """Serializer for the MaintenanceTicket model."""
    reported_by = UserSerializer(read_only=True)
    bike = BikeSerializer(read_only=True)

    class Meta:
        model = MaintenanceTicket
        fields = (
            'id',
            'bike',
            'reported_by',
            'description',
            'status',
            'created_at',
            'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at') 