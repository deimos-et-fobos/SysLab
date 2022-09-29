from django.conf import settings
from django.contrib.auth import views as auth_views
from django.urls import include, path

from .views import index

app_name = 'accounts'
urlpatterns = [
    path('', index, name='index'),
    # path('', include('django.contrib.auth.urls')),
    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='/accounts/login/'), name='logout'),
    path('change-password/', auth_views.PasswordChangeView.as_view(success_url='/accounts/change-password/done/'), name='password_change'),
    path('change-password/done/', auth_views.PasswordChangeDoneView.as_view(), name='password_change_done'),
]
