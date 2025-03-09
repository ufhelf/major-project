from rest_framework import serializers
from .models import SiteUser
from rest_framework.permissions import AllowAny

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteUser
        fields = ["username", "password"]
        permission_classes = [AllowAny]