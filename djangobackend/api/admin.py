from django.contrib import admin
from .models import SiteUser, ImageSet

@admin.register(SiteUser)
class SiteUserAdmin(admin.ModelAdmin):
    list_display = ["username", "password"]

@admin.register(ImageSet)
class ImageSetAdmin(admin.ModelAdmin):
    list_display = ["filename", "image"]