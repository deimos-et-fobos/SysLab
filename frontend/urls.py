from django.conf import settings
from django.urls import path

from .views import index

app_name = 'frontend'
urlpatterns = [
    path('', index, name='index'),
    # path('login/', index),
    path('<slug:labName>/', index),
    path('<slug:labName>/doctors/', index),
    path('<slug:labName>/doctors/new/', index),
    path('<slug:labName>/healthcare/', index),
    path('<slug:labName>/healthcare/new/', index),
    path('<slug:labName>/lab-user-types/', index),
    path('<slug:labName>/lab-user-types/new/', index),
    path('<slug:labName>/patients/', index),
    path('<slug:labName>/patients/new/', index),
    path('<slug:labName>/patients/<int:id>/', index),
    path('<slug:labName>/protocols/', index),
    path('<slug:labName>/protocols/new/', index),
    path('<slug:labName>/tests/', index),
    path('<slug:labName>/tests/new/', index),
    path('<slug:labName>/users/', index),
    path('<slug:labName>/users/new/', index),
]
