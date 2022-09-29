from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from accounts.models import Laboratory, LabMembers
from accounts.forms import UserChangeForm, UserCreationForm

User = get_user_model()

class LabInline(admin.TabularInline):
    model = LabMembers
    extra = 1
    verbose_name = _('laboratory')
    verbose_name_plural = _('laboratories')
    # show_change_link = True

class MemberInline(admin.TabularInline):
    model = LabMembers
    extra = 1
    verbose_name = _('member')
    verbose_name_plural = _('members')


class CustomUserAdmin(UserAdmin):
    # The forms to add and change user instances
    model = User
    form = UserChangeForm
    add_form = UserCreationForm


    list_display = ('__str__', 'name', 'type', 'is_active')
    if User.USERNAME_FIELD == 'email':
        fieldsets = (
            (None, {'fields': (User.USERNAME_FIELD,'password', 'first_name', 'last_name', 'type', 'profile_pic')}),
            (_('Permissions'), {'fields': ('is_superuser','is_staff','is_active','user_permissions')}),
            #('Grupos',{'fields': ('groups',)}),
        )
    else:
        fieldsets = (
            (None, {'fields': (User.USERNAME_FIELD,'password', 'first_name', 'last_name', 'email', 'type', 'profile_pic')}),
            (_('Permissions'), {'fields': ('is_superuser','is_staff','is_active','user_permissions')}),
            #('Grupos',{'fields': ('groups',)}),
        )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (User.USERNAME_FIELD, 'password1', 'password2'),
        }),
    )
    # list_filter = ()
    search_fields = ('email',)
    ordering = (User.USERNAME_FIELD,)
    filter_horizontal = ()
    inlines = [LabInline]
    

class LaboratoryAdmin(admin.ModelAdmin):
    model = Laboratory
    list_display = ('name', 'is_active')
    inlines = [MemberInline]


class LabMembersAdmin(admin.ModelAdmin):
    model = LabMembers
    list_display = ('user', 'laboratory', 'is_active')


admin.site.register(User, CustomUserAdmin)
admin.site.register(Laboratory, LaboratoryAdmin)
admin.site.register(LabMembers, LabMembersAdmin)
