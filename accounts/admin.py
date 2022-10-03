from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import GroupAdmin, UserAdmin
from django.utils.translation import gettext_lazy as _

from accounts.models import Laboratory, LabMember, LabUserType
from accounts.forms import UserChangeForm, UserCreationForm, LabMemberChangeForm

User = get_user_model()

class LabInline(admin.TabularInline):
    model = LabMember
    extra = 1
    exclude = ('permissions',)
    verbose_name = _('laboratory')
    verbose_name_plural = _('laboratories')
    # show_change_link = True

class MemberInline(admin.TabularInline):
    model = LabMember
    extra = 1
    exclude = ('permissions',)
    verbose_name = _('member')
    verbose_name_plural = _('members')


class CustomUserAdmin(UserAdmin):
    # The forms to add and change user instances
    model = User
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ('__str__', 'name', 'is_active')
    if User.USERNAME_FIELD == 'email':
        fieldsets = (
            (None, {'fields': (User.USERNAME_FIELD,'password', 'first_name', 'last_name', 'profile_pic')}),
            (_('Permissions'), {'fields': ('is_superuser','is_staff','is_active','user_permissions')}),
        )
    else:
        fieldsets = (
            (None, {'fields': (User.USERNAME_FIELD,'password', 'first_name', 'last_name', 'email', 'profile_pic')}),
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
    inlines = [LabInline]
    list_filter = ('is_staff', 'is_active', 'is_superuser')


class LaboratoryAdmin(admin.ModelAdmin):
    model = Laboratory
    list_display = ('name', 'is_active')
    inlines = [MemberInline]


class LabMemberAdmin(GroupAdmin):
    model = LabMember
    form = LabMemberChangeForm #Both create and change forms
    list_display = ('user', 'laboratory', 'user_type_name', 'is_active')
    ordering = ('user', 'laboratory')
    search_fields = ('user', 'laboratory__name', 'type')
    list_filter = ('is_active',)


class LabUserTypeAdmin(GroupAdmin):
    model = LabUserType
    list_display = ('laboratory', 'type', 'is_active')
    ordering = ('laboratory', 'type')
    search_fields = ('laboratory__name', 'type')
    list_filter = ('is_active',)

admin.site.register(Laboratory, LaboratoryAdmin)
admin.site.register(LabMember, LabMemberAdmin)
admin.site.register(LabUserType, LabUserTypeAdmin)
admin.site.register(User, CustomUserAdmin)
