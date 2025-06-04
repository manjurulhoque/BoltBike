from django.contrib import admin
from .models import Favorite


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ["user", "bike", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["user__username", "bike__title"]
    readonly_fields = ["created_at"]
