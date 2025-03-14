from django.contrib.auth import authenticate, get_user_model
from django.core.validators import EmailValidator
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
        fields = ('id', 'email', 'first_name', 'last_name', 'photo_url')

    def get_photo_url(self, user):
        request = self.context.get('request')
        if user.profile_pic and hasattr(user.profile_pic, 'url'):
           photo_url = user.profile_pic.url
           return request.build_absolute_uri(photo_url)
        else:
           return None

class UserUpdateSerializer(UserSerializer):
    delete_pic = serializers.BooleanField(default=False)
    profile_pic = serializers.ImageField(allow_null=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'photo_url', 'profile_pic', 'delete_pic')
        extra_kwargs = {
            'email': {
                'validators': [],
            }
        }
    
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


class LabMemberSessionSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    laboratory = LaboratorySerializer()
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = LabMember
        fields = ('id', 'user', 'laboratory', 'permissions', 'user_type', 'is_active')

    def get_permissions(self, lab_member):
        return list(lab_member.get_all_permissions())


class UserTypeSlugRelatedField(serializers.SlugRelatedField):
    def get_queryset(self):
        laboratory_id = self.context.get('laboratory_id')
        queryset = LabUserType.active.filter(laboratory__id=laboratory_id)
        return queryset
    
class LabMemberSerializer(serializers.ModelSerializer):
    user = UserUpdateSerializer()
    user_type = UserTypeSlugRelatedField(slug_field='type', allow_null=True, required=False)

    class Meta:
        model = LabMember
        fields = ('id', 'user', 'user_type', 'is_active')


    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        user = instance.user
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        serializer = UserUpdateSerializer(user, user_data)
        serializer.is_valid()
        serializer.save()
        return instance


class LabUserTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabUserType
        fields = ('id', 'type')
