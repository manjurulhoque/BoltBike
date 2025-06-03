from django.db import models
from django.utils.translation import gettext_lazy as _

from users.models import User
from bikes.models import Bike
from core.models import BaseModel


class Booking(BaseModel):
    """Model for bike rental bookings."""
    BOOKING_STATUSES = [
        ('requested', _('Requested')),
        ('approved', _('Approved')),
        ('active', _('Active')),
        ('completed', _('Completed')),
        ('cancelled', _('Cancelled')),
    ]

    bike = models.ForeignKey(
        Bike,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    renter = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='rentals'
    )
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    status = models.CharField(
        max_length=20,
        choices=BOOKING_STATUSES,
        default='requested'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.bike.title} - {self.renter.full_name()}"
