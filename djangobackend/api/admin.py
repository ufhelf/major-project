from django.contrib import admin
from .models import SiteUser, UploadImage, ImageSet

@admin.register(SiteUser)
class SiteUserAdmin(admin.ModelAdmin):
    list_display = ["username", "password"]

@admin.register(UploadImage)
class SiteUserAdmin(admin.ModelAdmin):
    list_display = ["filename", "image", "upload_date"]

class ImageInline(admin.TabularInline):  # or admin.StackedInline
    model = UploadImage
    fields = ('filename', 'image')
    extra = 1  # how many empty forms to show by default

class ImageSetAdmin(admin.ModelAdmin):
    inlines = [ImageInline]

admin.site.register(ImageSet, ImageSetAdmin)