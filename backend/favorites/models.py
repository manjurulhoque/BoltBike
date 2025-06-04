from django.db import models

from users.models import User
from bikes.models import Bike
from core.models import BaseModel


class Favorite(BaseModel):
    """Model for user's favorite bikes"""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    bike = models.ForeignKey(
        Bike, on_delete=models.CASCADE, related_name="favorited_by"
    )

    class Meta:
        unique_together = ("user", "bike")  # Prevent duplicate favorites
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.bike.title}"
