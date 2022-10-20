from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth import views as auth_views

# Create your views here.
def index(request):
    return HttpResponse("<h1>Accounts</h1>")

class LoginView(auth_views.LoginView):
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
