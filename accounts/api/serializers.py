from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from accounts.models import Laboratory, LabMember, LabUserType

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
        raise serializers.ValidationError(_('Bad Credentials.'))

class UserSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'photo_url', 'is_active', 'is_superuser')

    def get_photo_url(self, user):
        request = self.context.get('request')
        if user.profile_pic and hasattr(user.profile_pic, 'url'):
           photo_url = user.profile_pic.url
           return request.build_absolute_uri(photo_url)
        else:
           return None


class LaboratorySerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Laboratory
        fields = ('id', 'name', 'address', 'email', 'phone', 'url', 'photo_url', 'slug', 'is_active')

    def get_photo_url(self, laboratory):
        request = self.context.get('request')
        if laboratory.profile_pic and hasattr(laboratory.profile_pic, 'url'):
            photo_url = laboratory.profile_pic.url
            return request.build_absolute_uri(photo_url)
        else:
            return None


class LabMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabMember
        fields = ('id', 'user', 'laboratory', 'user_type', 'is_active')

class LabUserTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabUserType
        fields = '__all__'
