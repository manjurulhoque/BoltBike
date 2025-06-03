from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

from .managers import UserManager


class User(AbstractUser):
    """Custom user model for the e-bike rental platform."""

    username = None
    email = models.EmailField(
        unique=True,
        blank=False,
        error_messages={"unique": "A user with that email already exists."},
    )
    is_owner = models.BooleanField(
        default=False,
        help_text=_("Designates whether this user can list bikes for rent."),
    )
    is_renter = models.BooleanField(
        default=True, help_text=_("Designates whether this user can rent bikes.")
    )
    phone = models.CharField(
        max_length=20, blank=True, help_text=_("User's phone number")
    )
    profile_photo = models.ImageField(
        upload_to="profile_photos/",
        null=True,
        blank=True,
        help_text=_("User's profile photo"),
    )
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]
    objects = UserManager()

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def __str__(self):
        return self.full_name()
