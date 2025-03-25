from django.conf import settings
from django.urls import path

from lab.views import index

app_name = 'lab'
urlpatterns = [
    path('', index, name='index'),
    path('doctors/', index),
    path('doctors/new/', index),
    path('doctors/<int:id>/', index),
    path('healthcare/', index),
    path('healthcare/new/', index),
    path('healthcare/<int:id>/', index),
    path('lab-tests/', index),
    path('lab-tests/new/', index),
    path('lab-tests/<int:id>/', index),
    path('lab-test-groups/', index),
    path('patients/', index),
    path('patients/new/', index),
    path('patients/<int:id>/', index),
    


    
    path('user-types/', index),
    path('user-types/new/', index),
    path('protocols/', index),
    path('protocols/new/', index),
    path('users/', index),
    path('users/new/', index),
]
