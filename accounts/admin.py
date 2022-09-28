from django.conf import settings
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from accounts.models import CustomUser, Laboratory, LaboratoryUsers
from accounts.forms import UserChangeForm, UserCreationForm


class LaboratoryUsersInline(admin.TabularInline):
    model = LaboratoryUsers
    extra = 1
    # show_change_link = True

class CustomUserAdmin(UserAdmin):
    # The forms to add and change user instances
    model = CustomUser
    form = UserChangeForm
    add_form = UserCreationForm
    list_display = ('__str__', 'type', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password', 'first_name', 'last_name', 'type', 'profile_pic')}),
        (_('Permissions'), {'fields': ('is_superuser','is_staff','is_active','user_permissions')}),
        #('Grupos',{'fields': ('groups',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2'),
        }),
    )
    # list_filter = ()
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()
    inlines = [LaboratoryUsersInline]

class LaboratoryAdmin(admin.ModelAdmin):
    model = Laboratory
    list_display = ('name', 'is_active')
    inlines = [LaboratoryUsersInline]

class LaboratoryUsersAdmin(admin.ModelAdmin):
    model = LaboratoryUsers
    list_display = ('user', 'laboratory', 'is_active')


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Laboratory, LaboratoryAdmin)
admin.site.register(LaboratoryUsers, LaboratoryUsersAdmin)
