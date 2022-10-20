from django.conf import settings
from django.urls import path

from .views import LoginStatus, LoginView, UserView, LaboratoryView, LabMemberView
from knox import views as knox_views
from rest_framework.authentication import BasicAuthentication


app_name = 'accounts-api'
urlpatterns = [
    path('users/', UserView.as_view(), name='users'),
    path('labs/', LaboratoryView.as_view(), name='labs'),
    path('lab-users/', LabMemberView.as_view(), name='lab-users'),

    path('login/', LoginView.as_view(), name='knox_login'),
    path('login-status/', LoginStatus.as_view(), name='login-status'),
    path('logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('logoutall/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),
]
