from django.conf import settings
from django.urls import path
from rest_framework import generics
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.models import UserType
from accounts.api.serializers import UserTypeSerializer
from accounts.api.views import (CheckPerms, 
                                LoginView, LogoutView, 
                                ListCreateView, RetrieveUpdateDestroyView )

app_name = 'accounts-api'
urlpatterns = [
    path('check-perms/', CheckPerms.as_view(), name='check-perms'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('users/', ListCreateView.as_view(), name='user-list'),
    path('users/<int:id>/', RetrieveUpdateDestroyView.as_view(), name='user-detail'),
    path('user-types/', ListCreateView.as_view(queryset=UserType.objects.all(),serializer_class=UserTypeSerializer), name='user-type-list'),
    path('token-refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
