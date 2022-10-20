from django.conf import settings
from django.urls import path

from .views import index

app_name = 'frontend'
urlpatterns = [
    path('', index, name='index'),
    # path('login/', index),
    path('doctors/', index),
    path('healthcare/', index),
    path('patients/', index),
    path('protocols/', index),
    path('tests/', index),
    path('users/', index),
]
