from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("email", "first_name", "last_name", "is_owner", "is_renter", "is_staff")
    list_filter = ("is_owner", "is_renter", "is_staff", "is_superuser")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("email", "pk")
    
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name", "phone", "profile_photo")}),
        (_("Permissions"), {
            "fields": ("is_active", "is_staff", "is_superuser", "is_owner", "is_renter", "groups", "user_permissions"),
        }),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "password1", "password2", "first_name", "last_name"),
        }),
    )

