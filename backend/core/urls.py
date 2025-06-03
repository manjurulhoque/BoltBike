from django.urls import path
from django.views.generic import RedirectView

app_name = "core"

urlpatterns = [
    path("", RedirectView.as_view(url="/swagger/"), name="home"),
]
