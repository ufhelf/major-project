from django.urls import path
from . import views

urlpatterns = [
    path("siteusers/<str:username>&<str:password>", views.get_user, name="auth"),
    path("postimage/<str:setname>", views.PostImage, name="upload"),
    path("getallimages", views.GetAllImages, name="retrieve"),
    path("getimagesets", views.GetImageSets, name="retrieve_imgsets"),
    path("getimages/<str:setname>", views.GetImageBySet, name="getimages")
]