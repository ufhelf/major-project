from django.urls import path
from . import views

urlpatterns = [
    path("authenticate_user", views.authenticate_user, name="auth"),
    path("logout_user", views.logout_user, name="logout"),
    path("whoami", views.whoami, name="whoami"),
    path("get_csrf_token", views.get_csrf_token, name="get_csrf_token"),
    path("register_user", views.register_user, name="register"),

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