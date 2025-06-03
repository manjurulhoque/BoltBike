from django.urls import path

from .views import (
    SignupAPIView,
    TokenRefreshAPIView,
    LoginAPIView,
    MeAPIView,
)

app_name = "users"

urlpatterns = [
    path("auth/token/", LoginAPIView.as_view(), name="login"),
    path("auth/token/refresh/", TokenRefreshAPIView.as_view(), name="refresh"),
    path("auth/signup/", SignupAPIView.as_view(), name="signup"),
    path("me/", MeAPIView.as_view(), name="me"),
]
