import json
from django.http import JsonResponse

from django.shortcuts import render
from accounts.api.serializers import UserSerializer

def index(request, *args, **kwargs):
    # Pasar datos del context de Django a REACT
    context = {
        "user": request.session['user'] if request.user.is_authenticated else None,
        "laboratory": request.session['laboratory'] if request.user.is_authenticated else None,
    }
    
    return render(request, 'frontend/index.html', {"context": context})
