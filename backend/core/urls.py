from django.urls import path
from django.views.generic import RedirectView

from .views import HomePageAPIView

app_name = "core"

urlpatterns = [
    path("", RedirectView.as_view(url="/swagger/"), name="home"),
    path("home/", HomePageAPIView.as_view(), name="home"),
]
