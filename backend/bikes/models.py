from django.db import models
from django.utils.translation import gettext_lazy as _

from users.models import User
from core.models import BaseModel


class BikeStatus(models.TextChoices):
    AVAILABLE = "available", _("Available")
    UNAVAILABLE = "unavailable", _("Unavailable")
    MAINTENANCE = "maintenance", _("Maintenance")


class MaintenanceTicketStatus(models.TextChoices):
    OPEN = "open", _("Open")
    IN_PROGRESS = "in_progress", _("In Progress")
    RESOLVED = "resolved", _("Resolved")


class BikeType(models.TextChoices):
    CITY = "city", _("City")
    MOUNTAIN = "mountain", _("Mountain")
    ROAD = "road", _("Road")
    CARGO = "cargo", _("Cargo")
    FOLDING = "folding", _("Folding")
    HYBRID = "hybrid", _("Hybrid")


class Bike(BaseModel):
    """Model for e-bike listings."""

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bikes")
    title = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=255)
    hourly_rate = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    daily_rate = models.DecimalField(max_digits=10, decimal_places=2)
    bike_type = models.CharField(
        max_length=20, choices=BikeType.choices, default=BikeType.CITY
    )
    battery_range = models.PositiveIntegerField(help_text="Battery range in kilometers")
    max_speed = models.PositiveIntegerField(help_text="Maximum speed in km/h")
    weight = models.DecimalField(
        max_digits=5, decimal_places=2, help_text="Weight in kilograms"
    )
    features = models.JSONField(default=list, blank=True)
    status = models.CharField(
        max_length=20, choices=BikeStatus.choices, default=BikeStatus.AVAILABLE
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} - {self.owner.get_full_name()}"


class BikeImage(BaseModel):
    """Model for bike images."""

    bike = models.ForeignKey(Bike, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="bike_images/")
    alt_text = models.CharField(
        max_length=255, blank=True, help_text="Alternative text for accessibility"
    )
    caption = models.CharField(max_length=255, blank=True, help_text="Image caption")
    is_primary = models.BooleanField(
        default=False, help_text="Is this the primary/featured image"
    )
    order = models.PositiveIntegerField(
        default=0, help_text="Display order of the image"
    )

    class Meta:
        ordering = ["-is_primary", "order", "created_at"]
        unique_together = [["bike", "order"]]

    def __str__(self):
        return f"Image for {self.bike.title} - {self.image.name}"

    def save(self, *args, **kwargs):
        # Ensure only one primary image per bike
        if self.is_primary:
            BikeImage.objects.filter(bike=self.bike, is_primary=True).update(
                is_primary=False
            )
        super().save(*args, **kwargs)


class MaintenanceTicket(BaseModel):
    """Model for bike maintenance issues."""

    bike = models.ForeignKey(
        Bike, on_delete=models.CASCADE, related_name="maintenance_tickets"
    )
    reported_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reported_issues"
    )
    description = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=MaintenanceTicketStatus.choices,
        default=MaintenanceTicketStatus.OPEN,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Maintenance for {self.bike.title}"
