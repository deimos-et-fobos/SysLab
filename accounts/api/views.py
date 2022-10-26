from django.contrib.auth import get_user_model, login, logout
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
from knox.models import AuthToken
from knox.views import LogoutView as KnoxLogoutView
from rest_framework import generics, permissions, serializers, status, views
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import BasicAuthentication

from importlib import import_module
from django.conf import settings

from .serializers import LoginSerializer, UserSerializer, LaboratorySerializer, LabMemberSerializer
from accounts.models import Laboratory, LabMember

User = get_user_model()
SessionStore = import_module(settings.SESSION_ENGINE).SessionStore

class getLaboratory(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, labName, *args, **kwargs):
        laboratory = Laboratory.objects.get(slug=labName)
        return Response({
            'laboratory': LaboratorySerializer(laboratory, context={"request": request}).data,
        }, status=status.HTTP_200_OK)

class LoginStatus(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        # print('cookies',request.COOKIES)
        # print(request.headers.get('Authorization'))
        # print(request.session.__dict__)
        return Response({
            'user': UserSerializer(request.user, context={"request": request}).data,
            'auth':True
        }, status=status.HTTP_200_OK)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        # laboratory = Laboratory.objects.filter(slug=labName).first()
        # if not laboratory:
        #     Response({'details': _(f'Laboratory not found.')}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # if serializer.errors:
        #     raise serializers.ValidationError(serializer.errors)
        user = serializer.validated_data
        token = AuthToken.objects.create(user)[1]
        # if user:
        #     # login(request, user)
        #     # request.session['user'] = UserSerializer(user, context={"request": request}).data
        #     # request.session['laboratory'] = LaboratorySerializer(laboratory, context={"request": request}).data
        #     # request.session['token'] = token
        #     print(request.session.__dict__)
        # else:
        #     raise serializers.ValidationError('Could not Login, try again.')
        return Response({
            "user": UserSerializer(user, context={"request": request}).data,
            "token": token,
        }, status=status.HTTP_200_OK)

# class LoginView(KnoxLoginView):
#     authentication_classes = [BasicAuthentication]
#   With basic auth, you include an Authorization property on the headers key
#   in the options object with the fetch() method. For it’s value, you use the
#   following pattern: Basic USERNAME:PASSWORD.
#   The username and password need to be base64 encoded,
#   which we can do with the window.btoa() method.
#   ADD TOKEN TO COOKIE
#   document.cookie = "token=asdfnysdfhhih; expires=Thu, 18 Dec 2013 12:00:00 UTC";

class LogoutView(KnoxLogoutView):
    def post(self, request, *args, **kwargs):
        # logout(request)
        super().post(request, *args, **kwargs)

class UserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class LaboratoryView(generics.ListAPIView):
    queryset = Laboratory.objects.all()
    serializer_class = LaboratorySerializer

class LabMemberView(generics.ListAPIView):
    queryset = LabMember.objects.all()
    serializer_class = LabMemberSerializer
