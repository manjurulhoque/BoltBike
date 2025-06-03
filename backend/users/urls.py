from django.urls import path

from .views import (
    SignupView,
    CustomTokenRefreshView,
    LoginView,
)

app_name = "users"

urlpatterns = [
    path("auth/token/", LoginView.as_view(), name="login"),
    path("auth/token/refresh/", CustomTokenRefreshView.as_view(), name="refresh"),
    path("auth/signup/", SignupView.as_view(), name="signup"),
]
