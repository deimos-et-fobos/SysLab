from django.conf import settings
from django.urls import path

from .views import index, LoginView, UserView, LaboratoryView, LaboratoryUsersView
from knox import views as knox_views
from rest_framework.authentication import BasicAuthentication


app_name = 'accounts-api'
urlpatterns = [
    path('', index, name='index'),
    path('users/', UserView.as_view(), name='users'),
    path('labs/', LaboratoryView.as_view(), name='labs'),
    path('lab-users/', LaboratoryUsersView.as_view(), name='lab-users'),
    
    path('login/', LoginView.as_view(), name='knox_login'),
    path('logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('logoutall/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),
]
