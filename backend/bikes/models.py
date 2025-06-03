from django.db import models
from django.utils.translation import gettext_lazy as _

from users.models import User
from core.models import BaseModel


class Bike(BaseModel):
    """Model for e-bike listings."""
    BIKE_STATUSES = [
        ('available', _('Available')),
        ('unavailable', _('Unavailable')),
        ('maintenance', _('In Maintenance')),
    ]

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='bikes'
    )
    title = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=255)
    hourly_rate = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    daily_rate = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    status = models.CharField(
        max_length=20,
        choices=BIKE_STATUSES,
        default='available'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.owner.full_name()}"


class MaintenanceTicket(BaseModel):
    """Model for bike maintenance issues."""
    TICKET_STATUSES = [
        ('open', _('Open')),
        ('in_progress', _('In Progress')),
        ('resolved', _('Resolved')),
    ]

    bike = models.ForeignKey(
        Bike,
        on_delete=models.CASCADE,
        related_name='maintenance_tickets'
    )
    reported_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reported_issues'
    )
    description = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=TICKET_STATUSES,
        default='open'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Maintenance for {self.bike.title}"
