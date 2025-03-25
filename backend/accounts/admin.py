from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from accounts.models import Laboratory, UserType
from accounts.forms import UserChangeForm, UserCreationForm

User = get_user_model()

class CustomUserAdmin(UserAdmin):
    # The forms to add and change user instances
    model = User
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ('__str__', 'full_name', 'is_active')
    if User.USERNAME_FIELD == 'email':
        fieldsets = (
            (None, {'fields': (User.USERNAME_FIELD,'password', 'first_name', 'last_name', 'profile_pic', 'type')}),
            (_('Permissions'), {'fields': ('is_superuser','is_staff','is_active','user_permissions')}),
        )
    else:
        fieldsets = (
            (None, {'fields': (User.USERNAME_FIELD,'password', 'first_name', 'last_name', 'email', 'profile_pic', 'type')}),
            (_('Permissions'), {'fields': ('is_superuser','is_staff','is_active','user_permissions')}),
        )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (User.USERNAME_FIELD, 'password1', 'password2'),
        }),
    )
    # list_filter = ()
    search_fields = (User.USERNAME_FIELD,)
    ordering = (User.USERNAME_FIELD,)
    filter_horizontal = ()
    list_filter = ('is_staff', 'is_active', 'is_superuser')


class LaboratoryAdmin(admin.ModelAdmin):
    model = Laboratory
    list_display = ('name', 'is_active')


admin.site.register(Laboratory, LaboratoryAdmin)
admin.site.register(UserType)
admin.site.register(User, CustomUserAdmin)
