from django.db import models
from django.utils.translation import gettext_lazy as _
from core.models import BaseModel
from bookings.models import Booking


class Payment(BaseModel):
    """Model for payment transactions."""
    PAYMENT_STATUSES = [
        ("pending", _("Pending")),
        ("completed", _("Completed")),
        ("failed", _("Failed")),
        ("refunded", _("Refunded")),
    ]

    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
        related_name="payment",
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    stripe_payment_id = models.CharField(
        max_length=100,
        blank=True
    )
    status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUSES,
        default="pending",
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Payment for {self.booking}"
