from django.contrib import admin
from .models import Rating


@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ("bike", "user", "rating", "created_at")
    list_filter = ("rating",)
    search_fields = ("bike__title", "user__email")
