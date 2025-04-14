from rest_framework import serializers
from .models import SiteUser, ImageSet
from rest_framework.permissions import AllowAny

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteUser
        fields = ["username", "password"]
        permission_classes = [AllowAny]

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageSet
        fields = ["filename", "image"]
        permission_classes = [AllowAny]