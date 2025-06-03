from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("bike", "renter", "start_time", "end_time", "total_price", "status")
    list_filter = ("status", "bike__owner", "renter")
    search_fields = ("bike__title", "renter__email")
