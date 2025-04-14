from django.urls import path
from . import views

urlpatterns = [
    path("siteusers/<str:username>&<str:password>", views.get_user, name="test"),
    path("postimage", views.PostImage, name="testupload")
]