from django.urls import path

from .views import (
    SignupAPIView,
    TokenRefreshAPIView,
    LoginAPIView,
    MeAPIView,
    PasswordResetRequestAPIView,
    PasswordResetConfirmAPIView,
)

app_name = "users"

urlpatterns = [
    path("auth/token/", LoginAPIView.as_view(), name="login"),
    path("auth/token/refresh/", TokenRefreshAPIView.as_view(), name="refresh"),
    path("auth/signup/", SignupAPIView.as_view(), name="signup"),
    path("auth/password-reset/", PasswordResetRequestAPIView.as_view(), name="password-reset-request"),
    path("auth/password-reset-confirm/<str:uid>/<str:token>/", PasswordResetConfirmAPIView.as_view(), name="password-reset-confirm"),
    path("me/", MeAPIView.as_view(), name="me"),
]
