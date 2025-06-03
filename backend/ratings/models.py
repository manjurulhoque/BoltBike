from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from core.models import BaseModel
from bikes.models import Bike
from users.models import User


class Rating(BaseModel):
    """Model for bike ratings."""

    bike = models.ForeignKey(Bike, on_delete=models.CASCADE, related_name="ratings")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ratings")
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ("bike", "user")
