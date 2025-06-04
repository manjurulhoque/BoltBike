from django.contrib import admin
from .models import Bike, BikeImage, MaintenanceTicket


class BikeImageInline(admin.TabularInline):
    model = BikeImage
    extra = 1
    fields = ('image', 'alt_text', 'caption', 'is_primary', 'order')


@admin.register(Bike)
class BikeAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "location", "bike_type", "status", "daily_rate", "created_at")
    list_filter = ("status", "bike_type", "owner")
    search_fields = ("title", "location", "owner__email")
    inlines = [BikeImageInline]


@admin.register(BikeImage)
class BikeImageAdmin(admin.ModelAdmin):
    list_display = ('bike', 'alt_text', 'is_primary', 'order', 'created_at')
    list_filter = ('is_primary', 'created_at')
    search_fields = ('bike__title', 'alt_text', 'caption')
    ordering = ('bike', '-is_primary', 'order')


@admin.register(MaintenanceTicket)
class MaintenanceTicketAdmin(admin.ModelAdmin):
    list_display = ('bike', 'reported_by', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('bike__title', 'description')
    ordering = ('-created_at',)
