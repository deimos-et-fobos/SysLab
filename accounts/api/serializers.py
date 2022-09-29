from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.models import Laboratory, LaboratoryUsers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'password', 'type', 'is_active', 'is_superuser')

class LaboratorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Laboratory
        fields = ('id', 'name', 'address', 'email', 'phone', 'user', 'url', 'is_active')

class LaboratoryUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = LaboratoryUsers
        fields = ('id', 'user', 'laboratory', 'is_active')
