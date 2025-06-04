from rest_framework import serializers
from .models import Bike, BikeImage, MaintenanceTicket
from users.serializers import UserSerializer


class BikeImageSerializer(serializers.ModelSerializer):
    """Serializer for bike images."""

    image_url = serializers.SerializerMethodField()

    class Meta:
        model = BikeImage
        fields = [
            "id",
            "image",
            "image_url",
            "alt_text",
            "caption",
            "is_primary",
            "order",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_image_url(self, obj):
        """Get the full URL for the image."""
        if obj.image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class BikeSerializer(serializers.ModelSerializer):
    """Serializer for the Bike model."""

    owner = UserSerializer(read_only=True)
    images = BikeImageSerializer(many=True, read_only=True)
    image_files = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
        help_text="Upload multiple images for the bike",
    )

    class Meta:
        model = Bike
        fields = (
            "id",
            "owner",
            "title",
            "description",
            "location",
            "hourly_rate",
            "daily_rate",
            "bike_type",
            "battery_range",
            "max_speed",
            "weight",
            "features",
            "images",
            "image_files",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def validate_features(self, value):
        """Ensure features is a list."""
        if not isinstance(value, list):
            raise serializers.ValidationError("Features must be a list.")
        return value

    def create(self, validated_data):
        """Create bike and handle image uploads."""
        image_files = validated_data.pop("image_files", [])
        bike = super().create(validated_data)

        # Create BikeImage instances for uploaded files
        for i, image_file in enumerate(image_files):
            BikeImage.objects.create(
                bike=bike,
                image=image_file,
                is_primary=(i == 0),  # First image is primary
                order=i,
            )

        return bike

    def update(self, instance, validated_data):
        """Update bike and handle image uploads."""
        image_files = validated_data.pop("image_files", None)
        bike = super().update(instance, validated_data)

        # If new images are provided, create BikeImage instances
        if image_files:
            # Get the current highest order for existing images
            max_order = BikeImage.objects.filter(bike=bike).count()

            for i, image_file in enumerate(image_files):
                BikeImage.objects.create(
                    bike=bike,
                    image=image_file,
                    is_primary=False,  # Don't override existing primary image
                    order=max_order + i,
                )

        return bike


class MaintenanceTicketSerializer(serializers.ModelSerializer):
    """Serializer for the MaintenanceTicket model."""

    reported_by = UserSerializer(read_only=True)
    bike = BikeSerializer(read_only=True)

    class Meta:
        model = MaintenanceTicket
        fields = (
            "id",
            "bike",
            "reported_by",
            "description",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")
