from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save, pre_save, m2m_changed
from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.shortcuts import reverse
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _

def upload_location(instance, filename): # id = None when create
    instance_model = instance._meta.model_name
    if instance_model == 'customuser':
        return f"users/img/{slugify(instance.email)}"
    if instance_model == 'laboratory':
        return f"labs/img/{slugify(instance.name)}"
    return f"others/img/{slugify(instance.name)}"


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)


class ActiveCustomUserManager(CustomUserManager):
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_('email'), max_length=255, unique=True)
    # type = models.CharField(verbose_name='tipo', choices=USER_TYPE, max_length=1, default='T')
    first_name = models.CharField(_('first name'), max_length=150, blank=True)
    last_name = models.CharField(_('last name'), max_length=150, blank=True)
    profile_pic = models.ImageField(verbose_name=_('profile picture'), upload_to=upload_location, blank=True, null=True)
    # Fields from AbstractUser:
    # first_name, last_name, groups, is_staff, is_active, is_superuser, last_login, date_joinded

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] #['first_name', 'last_name', 'type']

    active = ActiveCustomUserManager()
    objects = CustomUserManager()

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return self.get_username()
    __str__.short_description = _('user')

    def _full_name(self):
        return self.get_full_name()
    _full_name.short_description = _('name')
    full_name = property(_full_name)

    # def get_absolute_url(self):
    #     if self.is_active:
    #         return reverse('lab:users_edit', kwargs={'pk':self.id})
    #     return reverse('lab:users')

    # def search(model, search):
    #     keys = search.split()
    #     objects = model.active.all()
    #     for key in keys:
    #         objects = objects.filter(
    #         Q(name__icontains=key) |
    #         Q(surname__icontains=key) |
    #         Q(id_number__icontains=key)
    #         )
    #     return objects

# def save_user_type(sender, instance, *args, **kwargs):
#     user = instance
#     type = user.type
#     if type and type != user.groups.all().first():
#         user.groups.set([type])
#     else:
#         user.groups.clear()
#
# def sync_type_to_group(sender, instance, action, *args, **kwargs):
#     user = instance
#     type = user.type
#     if action == 'post_add' or action == 'post_remove':
#         if type:
#             user.groups.set([type])
#         else:
#             user.groups.clear()
#
# post_save.connect(save_user_type, sender=CustomUser)
# m2m_changed.connect(sync_type_to_group, sender=CustomUser.groups.through)


class Laboratory(models.Model):
    name = models.CharField(_('name'), max_length=100, unique=True)
    slug = models.SlugField(_('slug'), max_length=100, unique=True)
    address = models.CharField(_('address'), max_length=100, blank=True)
    email = models.EmailField(_('email'), max_length=100, blank=True)
    phone = models.CharField(_('phone number'), max_length=30, blank=True)
    url = models.URLField(_('URL'), max_length=100, blank=True)
    profile_pic = models.ImageField(verbose_name=_('profile picture'), upload_to=upload_location, blank=True, null=True)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, _('users'), through='LabMember')
    is_active = models.BooleanField(_('active'), default=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _('laboratory')
        verbose_name_plural = _('laboratories')


class LabUserType(models.Model):
    type = models.CharField(_('user type'), max_length=20)
    laboratory = models.ForeignKey(Laboratory, verbose_name=_('laboratory'), on_delete=models.CASCADE)
    is_active = models.BooleanField(_('active'), default=True)
    permissions = models.ManyToManyField(Permission, verbose_name=_("permissions"), blank=True)

    def __str__(self):
        return f"{self.laboratory.name} - {self.type}"

    def get_permissions(self):
        permissions = self.permissions.all()
        _permissions = [ perm.content_type.app_label + '.' + perm.codename for perm in permissions]
        return set(_permissions)

    def has_perm(self, perm):
        return perm in self.get_permissions()

    def has_perms(self, perm_list):
        return all(self.has_perm(perm) for perm in perm_list)

    class Meta:
        unique_together = ['type', 'laboratory']
        verbose_name = _('lab user type')
        verbose_name_plural = _('lab user types')


class LabMember(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_('user'), on_delete=models.CASCADE)
    laboratory = models.ForeignKey(Laboratory, verbose_name=_('laboratory'), on_delete=models.CASCADE)
    # Limit the choices of user_type from LabMemberChangeForm
    user_type = models.ForeignKey(LabUserType, verbose_name=_('user type'), on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(_('active'), default=True)
    permissions = models.ManyToManyField(Permission, verbose_name=_("permissions"), blank=True)

    def get_permissions(self):
        permissions = self.permissions.all()
        _permissions = [ perm.content_type.app_label + '.' + perm.codename for perm in permissions]
        return set(_permissions)

    def get_usertype_permissions(self):
        return self.user_type.get_permissions()

    def get_all_permissions(self):
        return {*self.get_permissions(), *self.get_usertype_permissions()}

    def has_perm(self, perm):
        return perm in self.get_all_permissions()

    def has_perms(self, perm_list):
        return all(self.has_perm(perm) for perm in perm_list)

    def save(self, *args, **kwargs):
        if self.user_type:
            if self.laboratory != self.user_type.laboratory:
                raise ValidationError( _(f"You must choose a user type existing in '{self.laboratory.name}' laboratory") )
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.laboratory} - {self.user}"

    class Meta:
        unique_together = ['user', 'laboratory']
        verbose_name = _('laboratory member')
        verbose_name_plural = _('laboratory members')
