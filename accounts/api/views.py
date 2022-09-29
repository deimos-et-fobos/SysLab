from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.shortcuts import render
from knox.views import LoginView as KnoxLoginView
from rest_framework import generics
from rest_framework.authentication import BasicAuthentication

from .serializers import UserSerializer, LaboratorySerializer, LabMembersSerializer
from accounts.models import Laboratory, LabMembers

User = get_user_model()

class LoginView(KnoxLoginView):
    authentication_classes = [BasicAuthentication]
#   With basic auth, you include an Authorization property on the headers key
#   in the options object with the fetch() method. For it’s value, you use the
#   following pattern: Basic USERNAME:PASSWORD.
#   The username and password need to be base64 encoded,
#   which we can do with the window.btoa() method.
#   ADD TOKEN TO COOKIE
#   document.cookie = "token=asdfnysdfhhih; expires=Thu, 18 Dec 2013 12:00:00 UTC";

def index(request):
    return HttpResponse("<h1>Accounts API</h1>")

class UserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class LaboratoryView(generics.ListAPIView):
    queryset = Laboratory.objects.all()
    serializer_class = LaboratorySerializer

class LabMembersView(generics.ListAPIView):
    queryset = LabMembers.objects.all()
    serializer_class = LabMembersSerializer
