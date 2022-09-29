from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth.views import LoginView

# Create your views here.
def index(request):
    return HttpResponse("<h1>Accounts</h1>")
