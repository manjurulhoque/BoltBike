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
    # New fields for image management during updates
    delete_image_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        help_text="List of image IDs to delete",
    )
    primary_image_id = serializers.IntegerField(
        write_only=True, required=False, help_text="ID of the image to set as primary"
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
            "delete_image_ids",
            "primary_image_id",
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

    def validate_delete_image_ids(self, value):
        """Validate that image IDs belong to this bike."""
        if value and hasattr(self, "instance") and self.instance:
            bike_image_ids = list(self.instance.images.values_list("id", flat=True))
            invalid_ids = [img_id for img_id in value if img_id not in bike_image_ids]
            if invalid_ids:
                raise serializers.ValidationError(
                    f"Invalid image IDs: {invalid_ids}. These images don't belong to this bike."
                )
        return value

    def validate_primary_image_id(self, value):
        """Validate that primary image ID belongs to this bike."""
        if value and hasattr(self, "instance") and self.instance:
            if not self.instance.images.filter(id=value).exists():
                raise serializers.ValidationError(
                    "Invalid primary image ID. This image doesn't belong to this bike."
                )
        return value

    def create(self, validated_data):
        """Create bike and handle image uploads."""
        image_files = validated_data.pop("image_files", [])
        validated_data.pop("delete_image_ids", None)  # Not applicable for creation
        validated_data.pop("primary_image_id", None)  # Not applicable for creation

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
        """Update bike and handle image management."""
        image_files = validated_data.pop("image_files", None)
        delete_image_ids = validated_data.pop("delete_image_ids", None)
        primary_image_id = validated_data.pop("primary_image_id", None)

        bike = super().update(instance, validated_data)

        # Delete specified images
        if delete_image_ids:
            BikeImage.objects.filter(bike=bike, id__in=delete_image_ids).delete()

        # Add new images if provided
        if image_files:
            # Get the current highest order for existing images
            max_order = BikeImage.objects.filter(bike=bike).count()

            for i, image_file in enumerate(image_files):
                BikeImage.objects.create(
                    bike=bike,
                    image=image_file,
                    is_primary=False,  # Don't override existing primary image automatically
                    order=max_order + i,
                )

        # Set primary image if specified
        if primary_image_id:
            # Unset current primary
            BikeImage.objects.filter(bike=bike, is_primary=True).update(
                is_primary=False
            )
            # Set new primary
            BikeImage.objects.filter(bike=bike, id=primary_image_id).update(
                is_primary=True
            )

        # Ensure at least one image is primary if images exist
        bike_images = BikeImage.objects.filter(bike=bike)
        if bike_images.exists() and not bike_images.filter(is_primary=True).exists():
            first_image = bike_images.first()
            first_image.is_primary = True
            first_image.save()

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
