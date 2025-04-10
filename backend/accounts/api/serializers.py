from django.contrib.auth import authenticate, get_user_model
from django.core.validators import EmailValidator
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.models import Laboratory, UserType

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate_email(self, email):
        if User.objects.filter(email=email, is_active=True).first():
            return email
        raise serializers.ValidationError(_('User not registered or not active.'))

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError(_('Bad Credentials or User is not active.'))

class UserTypeSerializer(serializers.ModelSerializer):
    type = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=UserType.objects.all(),
                message=_("There is already another user type with this name. It may be not active."),
                lookup='iexact',
            )
        ]
    )
    class Meta:
        model = UserType
        exclude = ('group',)

class UserSerializer(serializers.ModelSerializer):
    type = serializers.SlugRelatedField(queryset=UserType.active.all(), slug_field='type', allow_null=True)
    type_choices = serializers.SerializerMethodField(read_only=True)
    photo_url = serializers.SerializerMethodField()
    delete_pic = serializers.BooleanField(default=False)
    profile_pic = serializers.ImageField(allow_null=True, required=False)
    
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'photo_url', 'type', 'is_active',
                  'profile_pic', 'delete_pic', 'type_choices')

    def get_photo_url(self, user):
        request = self.context.get('request')
        if user.profile_pic and hasattr(user.profile_pic, 'url'):
           photo_url = user.profile_pic.url
           return request.build_absolute_uri(photo_url)
        return None
    
    def get_type_choices(self, obj):
        return [None] + list(UserType.active.all().values_list('type', flat=True))
    
    def update(self, instance, validated_data):
        data = validated_data
        email = data.get('email')
        user = User.objects.filter(email=email).first()
        if user != instance:
            raise serializers.ValidationError({'user': {'email': _('There is already another user with this email.')}})
        if ('profile_pic' in data) and not data.get('profile_pic'):
            data.pop('profile_pic')
        if ('delete_pic' in data) and data.get('delete_pic'):
            data['profile_pic'] = None
        for attr, value in data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
    # def get_permissions(self, obj):
    #     return obj.get_all_permissions()
    
class UserListSerializer(UserSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'photo_url', 'type', 'is_active')

class LaboratorySerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Laboratory
        fields = ('id', 'name', 'address', 'email', 'phone', 'url', 'photo_url', 'slug')

    def get_photo_url(self, laboratory):
        request = self.context.get('request')
        if laboratory.profile_pic and hasattr(laboratory.profile_pic, 'url'):
            photo_url = laboratory.profile_pic.url
            return request.build_absolute_uri(photo_url)
        else:
            return None

