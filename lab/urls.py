from django.conf import settings
from django.contrib.auth import views as auth_views
from django.urls import include, path

from .views import index

app_name = 'lab'
urlpatterns = [
    path('', index, name='index'),
]
