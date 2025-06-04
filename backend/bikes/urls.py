from django.urls import path

from .views import (
    BikeListAPIView,
    BikeCreateAPIView,
    BikeDetailAPIView,
    MyBikesAPIView,
    MaintenanceTicketListCreateAPIView,
    BikeImageListCreateAPIView,
    BikeImageDetailAPIView,
    toggle_bike_status_api_view,
    set_primary_image_api_view,
)

app_name = "bikes"

urlpatterns = [
    path("", BikeListAPIView.as_view(), name="bike-list"),
    path("create/", BikeCreateAPIView.as_view(), name="bike-create"),
    path("<int:pk>/", BikeDetailAPIView.as_view(), name="bike-detail"),
    path("my-bikes/", MyBikesAPIView.as_view(), name="my-bikes"),
    path(
        "<int:pk>/toggle-status/",
        toggle_bike_status_api_view,
        name="toggle-bike-status",
    ),
    path(
        "<int:bike_id>/images/",
        BikeImageListCreateAPIView.as_view(),
        name="bike-images",
    ),
    path(
        "<int:bike_id>/images/<int:pk>/",
        BikeImageDetailAPIView.as_view(),
        name="bike-image-detail",
    ),
    path(
        "<int:bike_id>/images/<int:image_id>/set-primary/",
        set_primary_image_api_view,
        name="set-primary-image",
    ),
    path(
        "maintenance/",
        MaintenanceTicketListCreateAPIView.as_view(),
        name="maintenance-list-create",
    ),
]
