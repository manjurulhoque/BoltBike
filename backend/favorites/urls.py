from django.urls import path
from . import views

app_name = "favorites"

urlpatterns = [
    path("", views.FavoriteListView.as_view(), name="favorites-list"),
    path("create/", views.FavoriteCreateView.as_view(), name="favorites-create"),
    path("<int:bike_id>/delete/", views.FavoriteDeleteView.as_view(), name="favorite-delete"),
    path("<int:bike_id>/check/", views.FavoriteStatusView.as_view(), name="favorite-status"),
    path("<int:bike_id>/toggle/", views.FavoriteToggleView.as_view(), name="favorite-toggle"),
]