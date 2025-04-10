# accounts/api/test_permissions.py

from django.test import TestCase
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory
from django.contrib.auth.models import Permission
from accounts.models import CustomUser
from accounts.api.permissions import CreateRetrieveUpdateDestroyPermission
from accounts.api.views import RetrieveUpdateDestroyView


class CreateRetrieveUpdateDestroyPermissionTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = RetrieveUpdateDestroyView()
        self.permission = CreateRetrieveUpdateDestroyPermission()
        self.user = CustomUser.objects.create_user(
            email="test@example.com",
            password="pass"
        )

    def test_get_without_permission_denied(self):
        request = self.factory.get("/users/")
        request.user = self.user
        perm = self.permission.has_permission(request, self.view)
        self.assertFalse(perm)

    def test_get_with_view_permission_allowed(self):
        perm_codename = "view_customuser"
        permission = Permission.objects.get(codename=perm_codename)
        self.user.user_permissions.add(permission)
        request = self.factory.get("/users/")
        request.user = self.user
        perm = self.permission.has_permission(request, self.view)
        self.assertTrue(perm)

    def test_put_without_permission_denied(self):
        request = self.factory.put("/users/1/")
        request.user = self.user
        perm = self.permission.has_permission(request, self.view)
        self.assertFalse(perm)

    def test_put_with_change_permission_allowed(self):
        perm_codename = "change_customuser"
        permission = Permission.objects.get(codename=perm_codename)
        self.user.user_permissions.add(permission)
        request = self.factory.put("/users/1/")
        request.user = self.user
        perm = self.permission.has_permission(request, self.view)
        self.assertTrue(perm)
