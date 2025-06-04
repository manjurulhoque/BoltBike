from rest_framework import serializers
from .models import Favorite
from bikes.serializers import BikeSerializer


class FavoriteSerializer(serializers.ModelSerializer):
    """Serializer for Favorite model"""

    bike = BikeSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ["id", "bike", "created_at"]
        read_only_fields = ["id", "created_at"]


class CreateFavoriteSerializer(serializers.ModelSerializer):
    """Serializer for creating favorites"""

    class Meta:
        model = Favorite
        fields = ["bike"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
