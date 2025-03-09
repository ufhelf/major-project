from http import HTTPStatus
from django.http import JsonResponse
from django.core import serializers
from rest_framework import generics
from rest_framework.decorators import api_view
from .models import SiteUser
from .serializers import UserSerializer
from rest_framework.response import Response
from api.serializers import UserSerializer

@api_view(['GET'])
def get_user(request, username, password):
    try:
        user = SiteUser.objects.get(username=username, password=password)
    except SiteUser.DoesNotExist:
        return Response(status=HTTPStatus.NOT_FOUND)
    return Response(UserSerializer(user).data)

#Extra code incase
'''
class UserView(generics.CreateAPIView):
    queryset = SiteUser.objects.all()
    serializer_class = UserSerializer

    def get(self, user):
        data = serializers.serialize("json", SiteUser.objects.all())
        #_user = self.kwargs["user"]
        #_pass = self.kwargs["pass"]
        
        for x in SiteUser.objects.all():
            print(x)

        return JsonResponse(data, safe=False)
    
    def post(self, request):
        serializer = UserSerializer(request.data)

        if serializer.is_valid():
            return Response({'status': 'password set'})'''
        