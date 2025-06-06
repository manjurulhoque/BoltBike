from django.urls import path

from .views import (
    RatingListAPIView,
    RatingCreateAPIView,
    RatingDetailAPIView,
    BikeRatingsAPIView,
    MyRatingsAPIView,
    RateableBookingsAPIView,
    bike_rating_stats_api_view,
)

app_name = "ratings"

urlpatterns = [
    path("", RatingListAPIView.as_view(), name="rating-list"),
    path("create/", RatingCreateAPIView.as_view(), name="rating-create"),
    path("<int:pk>/", RatingDetailAPIView.as_view(), name="rating-detail"),
    path("my-ratings/", MyRatingsAPIView.as_view(), name="my-ratings"),
    path("rateable-bookings/", RateableBookingsAPIView.as_view(), name="rateable-bookings"),
    path("bikes/<int:bike_id>/", BikeRatingsAPIView.as_view(), name="bike-ratings"),
    path("bikes/<int:bike_id>/stats/", bike_rating_stats_api_view, name="bike-rating-stats"),
] 