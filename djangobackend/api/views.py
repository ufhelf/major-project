from http import HTTPStatus
from django.http import HttpResponse, JsonResponse, QueryDict
from rest_framework.decorators import api_view
from .models import *
from .serializers import *
from rest_framework.response import Response
from api.serializers import UserSerializer

@api_view(['GET'])
def get_user(request, username, password):
    try:
        user = SiteUser.objects.get(username=username, password=password)
    except SiteUser.DoesNotExist:
        return Response(status=HTTPStatus.NOT_FOUND)
    return Response(UserSerializer(user).data)

@api_view(["POST"])
def PostImage(request, setname):   
    uploaded_file = request.FILES.get('file')
    img_set = ImageSet.objects.get(setname=setname)
    image = UploadImage.objects.create(filename=uploaded_file.name, image=uploaded_file, setname=img_set)
    return JsonResponse({"message": "Image saved successfully"})
    
@api_view(["GET"])
def GetAllImages(request): #Get all images, for testing only
    images = UploadImage.objects.all()
    serializer = ImageSerializer(images, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(["GET"])
def GetImageSets(request):
    sets = ImageSet.objects.all()
    #set = ImageSet.objects.get(setname="set1")
    #print(set.setname)
    s = ImageSetSerialiser(sets, many=True)
    return Response(s.data)

@api_view(["GET"])
def GetImageBySet(request, setname):
    try:
        IMGSET = ImageSet.objects.get(setname=setname)
    except:
        return Response(status=HTTPStatus.NOT_FOUND)
    images = UploadImage.objects.filter(setname=IMGSET)
    s = ImageSerializer(images, many=True, context={'request': request})
    return Response(s.data)

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
        