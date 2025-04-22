from rest_framework import serializers
from .models import SiteUser, ImageSet, UploadImage
from rest_framework.permissions import AllowAny

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteUser
        fields = ["username", "password"]
        permission_classes = [AllowAny]

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadImage
        fields = ["filename", "image"]
        permission_classes = [AllowAny]

        def get_image(self, obj):
            request = self.context.get('request')
            if obj.image and request:
                return request.build_absolute_uri(obj.image.url)
            return None

class ImageSetSerialiser(serializers.ModelSerializer):
    class Meta:
        model = ImageSet
        fields = ["setname"]
        permission_classes = [AllowAny]