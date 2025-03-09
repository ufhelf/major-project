from django.contrib import admin
from .models import SiteUser

@admin.register(SiteUser)
class SiteUserAdmin(admin.ModelAdmin):
    list_display = ["username", "password"]