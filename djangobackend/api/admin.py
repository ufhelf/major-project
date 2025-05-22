from django.contrib import admin
from .models import UploadImage, ImageSet
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