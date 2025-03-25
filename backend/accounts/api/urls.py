from django.conf import settings
from django.urls import path
from rest_framework import generics
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.api.views import ( LabMemberDetailView, LabMemberListView, 
                                LoginView, LogoutView, 
                                ListCreateView, RetrieveUpdateDestroyView,
                                LabUserTypeListView )

app_name = 'accounts-api'
urlpatterns = [
    # path('labs/', LaboratoryView.as_view(), name='labs'),
    # path('lab-users/', LabMemberView.as_view(), name='lab-users'),
    # path('lab-user-types/', LabUserTypeView.as_view(), name='lab-user-types'),
    # path('users/', UserView.as_view(), name='users'),
    # path('get-laboratory/<slug:labName>/', getLaboratory.as_view(), name='get-laboratory'),

    path('login/', LoginView.as_view(), name='login'),
    path('login/<slug:labName>/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('lab-users/', LabMemberListView.as_view(), name='lab-user-List'),
    path('lab-users/<int:id>/', LabMemberDetailView.as_view(), name='lab-user-Detail'),
    path('lab-user-types/', LabUserTypeListView.as_view(), name='lab-user-type-List'),
    path('token-refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
