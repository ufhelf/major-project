from django.urls import path
from . import views

urlpatterns = [
    path("siteusers/<str:username>&<str:password>", views.get_user, name="auth"),

    path("postimage/<str:setname>", views.PostImage, name="upload"),
    path("getallimages", views.GetAllImages, name="retrieve"),
    path("getimages/<str:setname>", views.GetImageBySet, name="getimages"),
    path("deleteimage/<str:setname>", views.DeleteImage, name="deleteimg"),

    path("getimagesets", views.GetImageSets, name="retrieve_imgsets"),
    path("postimageset", views.CreateImageSet, name="createSet"),
    path("deleteimageset/<str:name>", views.DeleteImageSet, name="deleteSet"),
    path("getimageset/<str:name>", views.getimageset, name="getimgset"),
    path("setcoverimage/<str:name>", views.ChangeImageSetCover, name="changecoverimage"),
    path("changeimageset/<str:name>", views.ChangeImageSet, name="changeimageset")
]