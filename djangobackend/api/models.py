from django.db import models

class SiteUser(models.Model):
    username = models.CharField(max_length=25)
    password = models.CharField(max_length=25)
    objects = models.Manager()

class ImageSet(models.Model):
    setname = models.CharField(max_length=50, unique=True)
    coverImage = models.ImageField(upload_to="coverimages", blank=True)
    date = models.DateField(auto_now_add=False, blank=True)
    objects = models.Manager() 

class UploadImage(models.Model):
    filename = models.CharField(max_length=50)
    image = models.ImageField(upload_to="images")
    upload_date = models.DateTimeField(auto_now_add=True, blank=True)
    setname = models.ForeignKey(ImageSet, on_delete=models.CASCADE, related_name='images') #Linked with image set table, must be unique
    objects = models.Manager() 