from django.db import models

class SiteUser(models.Model):
    username = models.CharField(max_length=25)
    password = models.CharField(max_length=25)
    objects = models.Manager()

class ImageSet(models.Model):
    filename = models.CharField(max_length=50)
    image = models.ImageField(upload_to="images")
    objects = models.Manager()