from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("bike", "renter", "start_time", "end_time", "total_price", "status", "created_at")
    list_filter = ("status", "bike__owner", "renter", "created_at")
    search_fields = ("bike__title", "renter__email", "renter__first_name", "renter__last_name")
    readonly_fields = ("created_at", "updated_at", "total_price")
    list_per_page = 25
    date_hierarchy = "created_at"
    
    fieldsets = (
        ("Booking Details", {
            "fields": ("bike", "renter", "start_time", "end_time", "total_price")
        }),
        ("Status", {
            "fields": ("status",)
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )
