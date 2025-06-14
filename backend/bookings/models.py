from django.db import models
from django.utils.translation import gettext_lazy as _

from users.models import User
from bikes.models import Bike
from core.models import BaseModel


class BookingStatus(models.TextChoices):
    REQUESTED = "requested", _("Requested")
    APPROVED = "approved", _("Approved")
    ACTIVE = "active", _("Active")
    COMPLETED = "completed", _("Completed")
    CANCELLED = "cancelled", _("Cancelled")


class Booking(BaseModel):
    """Model for bike rental bookings."""

    bike = models.ForeignKey(Bike, on_delete=models.CASCADE, related_name="bookings")
    renter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="rentals")
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=BookingStatus.choices,
        default=BookingStatus.REQUESTED,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.bike.title} - {self.renter.get_full_name()}"
