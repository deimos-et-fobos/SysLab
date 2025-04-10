from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save
from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission
from django.dispatch import receiver
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

class ActiveObjectsManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)
    
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

class UserType(models.Model):
    type = models.CharField(_('user type'), max_length=100, unique=True)
    group = models.OneToOneField(Group, verbose_name=_('group'), on_delete=models.SET_NULL, null=True)
    is_active = models.BooleanField(_('active'), default=True)
    
    active = ActiveCustomUserManager()
    objects = models.Manager()

    class Meta:
        permissions = (('list_usertype', "Can list UserTypes"),)
        
    def __str__(self):
        return self.type

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_('email'), max_length=255, unique=True)
    # type = models.CharField(verbose_name='tipo', choices=USER_TYPE, max_length=1, default='T')
    first_name = models.CharField(_('first name'), max_length=150, blank=True)
    last_name = models.CharField(_('last name'), max_length=150, blank=True)
    profile_pic = models.ImageField(verbose_name=_('profile picture'), upload_to=upload_location, blank=True, null=True)
    type = models.ForeignKey(UserType, verbose_name=_('user type'), on_delete=models.SET_NULL, null=True, blank=True)
    # Fields from AbstractUser:
    # first_name, last_name, groups, is_staff, is_active, is_superuser, last_login, date_joinded

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] #['first_name', 'last_name', 'type']

    active = ActiveCustomUserManager()
    objects = CustomUserManager()

    class Meta:
        permissions = (('list_customuser', "Can list CustomUser"),)
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


class Laboratory(models.Model):
    name = models.CharField(_('name'), max_length=100, unique=True)
    slug = models.SlugField(_('slug'), max_length=100, unique=True)
    address = models.CharField(_('address'), max_length=100, blank=True)
    email = models.EmailField(_('email'), max_length=100, blank=True)
    phone = models.CharField(_('phone number'), max_length=30, blank=True)
    url = models.URLField(_('URL'), max_length=100, blank=True)
    profile_pic = models.ImageField(verbose_name=_('profile picture'), upload_to=upload_location, blank=True, null=True)
    is_active = models.BooleanField(_('active'), default=True)

    active = ActiveObjectsManager()
    objects = models.Manager()

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _('laboratory')
        verbose_name_plural = _('laboratories')


