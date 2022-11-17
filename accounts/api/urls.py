from django.conf import settings
from django.urls import path

from .views import LabUserTypeView, LoginView, LogoutView, UserView, LaboratoryView, LabMemberView
from rest_framework.authentication import BasicAuthentication


app_name = 'accounts-api'
urlpatterns = [
    path('labs/', LaboratoryView.as_view(), name='labs'),
    path('lab-users/', LabMemberView.as_view(), name='lab-users'),
    path('lab-user-types/', LabUserTypeView.as_view(), name='lab-user-types'),
    path('users/', UserView.as_view(), name='users'),
    # path('get-laboratory/<slug:labName>/', getLaboratory.as_view(), name='get-laboratory'),

    path('login/', LoginView.as_view(), name='login'),
    path('login/<slug:labName>/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
