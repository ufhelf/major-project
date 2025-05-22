from http import HTTPStatus
from django.http import HttpResponse, JsonResponse, QueryDict
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from .models import *
from .serializers import *
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
import os

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'message': 'CSRF cookie set'})

@login_required
def whoami(request):
    print(request.user.username)
    return JsonResponse({"username": request.user.username})

@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = User.objects.create_user(username, "", password)
    return JsonResponse({'message': 'Registered', 'username': user.username})

@api_view(['POST'])
def authenticate_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({'message': 'Authenticated', 'username': user.username})
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=401)

@api_view(['POST'])
def logout_user(request):
    logout(request)
    response = JsonResponse({'message': 'Logged out'})
    response.delete_cookie('sessionid')
    return response

@api_view(["POST"])
def PostImage(request, setname):   
    uploaded_file = request.FILES.get('file')
    img_set = ImageSet.objects.get(setname=setname)
    image = UploadImage.objects.create(filename=uploaded_file.name, image=uploaded_file, setname=img_set)
    return JsonResponse({"message": "Image saved successfully"})

    
@api_view(["GET"])
def GetAllImages(request): #Get all images, for testing only => pls dont actually use this
    images = UploadImage.objects.all()
    serializer = ImageSerializer(images, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(["GET"])
def GetImageSets(request):
    sets = ImageSet.objects.all()
    s = ImageSetSerialiser(sets, many=True, context={'request': request})
    return Response(s.data)

@api_view(["GET"])
def getimageset(request, name):
    try:
        s = ImageSet.objects.get(setname=name)
        s = ImageSetSerialiser(s, context={'request': request})
        return Response(s.data)
    except:
        return HTTPStatus.NOT_FOUND

@api_view(["POST"])
def CreateImageSet(request):
    data = request.data

    try:
        ImageSet.objects.get(setname=data.get("name"))
        return Response(status=HTTPStatus.CONFLICT)
    except: 
        ImageSet.objects.create(setname=data["name"], date=data["date"])
        return Response({"message": "Imageset created successfully"})

@api_view(["DELETE"])
def DeleteImage(request, setname):
    data = request.data
    s = ImageSet.objects.get(setname=setname)
    img = UploadImage.objects.get(setname=s, filename=data.get("name"))

    if img.image:
        image_path = img.image.path
        if os.path.exists(image_path):
            os.remove(image_path)

    img.delete()
    return Response({"message": "Imageset deleted successfully"})

@api_view(["DELETE"])
def DeleteImageSet(request, name):
    imgset = ImageSet.objects.get(setname=name)

    if imgset.coverImage:
        cover_image_path = imgset.coverImage.path
        if os.path.exists(cover_image_path):
            os.remove(cover_image_path)
    
    #Get all images from this imageset
    imgs = UploadImage.objects.filter(setname=imgset)

    #Delete the image stored on the server
    for img in imgs:
        if img.image:
            image_path = img.image.path
            if os.path.exists(image_path):
                os.remove(image_path)

    #remove from db
    imgs.delete()
    imgset.delete()

    return Response({"message": "Imageset deleted successfully"})

@api_view(["PUT"])
def ChangeImageSetCover(request, name):
    uploaded_file = request.FILES.get('file')
    imgset = ImageSet.objects.get(setname=name)

    try:
        imgset = ImageSet.objects.get(setname=name)
    except ImageSet.DoesNotExist:
        return Response({"error": "Image set not found"}, status=HTTPStatus.NOT_FOUND)
    
    if imgset.coverImage:
        old_image_path = imgset.coverImage.path
        if os.path.exists(old_image_path):
            os.remove(old_image_path)
    imgset.coverImage = uploaded_file
    imgset.save()

    return Response({"message": "Cover image updated successfully"})

@api_view(["PUT"])
def ChangeImageSet(request, name):
    data = request.data
    imgset = ImageSet.objects.get(setname=name)

    try:
        imgset.setname = data.get("name")
    except: pass

    try:
        imgset.date = data.get("date")
    except: pass
    imgset.save()
    return Response({"message": "imgset updated"})

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
        