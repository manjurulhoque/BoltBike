from django.contrib import admin
from .models import Bike


@admin.register(Bike)
class BikeAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "location", "status", "hourly_rate", "daily_rate")
    list_filter = ("status", "owner")
    search_fields = ("title", "location", "owner__email")
