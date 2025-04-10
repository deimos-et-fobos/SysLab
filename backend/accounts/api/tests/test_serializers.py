from django.test import TestCase
from django.contrib.auth.models import Group
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from unittest.mock import Mock

from accounts.models import UserType, Laboratory
from accounts.api.serializers import (
    LoginSerializer,
    UserTypeSerializer,
    UserSerializer,
    UserListSerializer,
    LaboratorySerializer
)

User = get_user_model()


class LoginSerializerTests(TestCase):
    def setUp(self):
        self.group = Group.objects.create(name="Test Group")
        self.usertype = UserType.objects.create(type="LoginTestType", group=self.group)
        self.user = User.objects.create_user(
            email="testlogin@example.com",
            password="testpass123",
            is_active=True,
            type=self.usertype
        )

    def test_valid_login(self):
        data = {"email": "testlogin@example.com", "password": "testpass123"}
        serializer = LoginSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_login_wrong_password(self):
        data = {"email": "testlogin@example.com", "password": "wrong"}
        serializer = LoginSerializer(data=data)
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_invalid_login_unregistered_user(self):
        data = {"email": "notexists@example.com", "password": "somepass"}
        serializer = LoginSerializer(data=data)
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)


class UserTypeSerializerTests(TestCase):
    def setUp(self):
        self.group = Group.objects.create(name="UserTypeGroup")
        self.usertype = UserType.objects.create(type="Doctor", group=self.group)

    def test_valid_usertype(self):
        data = {"type": "NewType"}
        serializer = UserTypeSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_duplicate_usertype(self):
        data = {"type": "Doctor"}
        serializer = UserTypeSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("type", serializer.errors)


class UserSerializerTests(TestCase):
    def setUp(self):
        self.group = Group.objects.create(name="UserGroup")
        self.usertype = UserType.objects.create(type="Scientist", group=self.group)
        self.user = User.objects.create_user(
            email="user@example.com",
            password="testpass",
            type=self.usertype,
            first_name="John",
            last_name="Doe",
        )

    def test_valid_user_update(self):
        data = {
            "email": "user@example.com",
            "first_name": "Updated",
            "last_name": "Name",
            "type": self.usertype.type,
            "is_active": True,
            "delete_pic": False
        }
        serializer = UserSerializer(instance=self.user, data=data, context={"request": None}, partial=True)
        self.assertTrue(serializer.is_valid())

    def test_email_already_taken(self):
        other_user = User.objects.create_user(email="other@example.com", password="testpass")
        data = {
            "email": "other@example.com",
            "first_name": "Duplicate",
            "last_name": "Email"
        }
        serializer = UserSerializer(instance=self.user, data=data, partial=True)
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)
        self.assertEqual(serializer.errors["email"][0],"Ya existe usuario con este email.")


    def test_delete_pic_sets_profile_pic_to_none(self):
        self.user.profile_pic = SimpleUploadedFile("pic.jpg", b"data", content_type="image/jpeg")
        self.user.save()
        data = {
            "email": self.user.email,
            "delete_pic": True
        }
        serializer = UserSerializer(instance=self.user, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertFalse(user.profile_pic and user.profile_pic.name)


class UserListSerializerTests(TestCase):
    def setUp(self):
        self.group = Group.objects.create(name="ListGroup")
        self.usertype = UserType.objects.create(type="Admin", group=self.group)
        self.user = User.objects.create_user(
            email="listuser@example.com",
            password="testpass",
            type=self.usertype,
            first_name="Alice",
            last_name="Wonder"
        )

    def test_user_list_serializer_fields(self):
        serializer = UserListSerializer(instance=self.user)
        data = serializer.data
        self.assertIn("email", data)
        self.assertNotIn("profile_pic", data)
        self.assertEqual(data["email"], "listuser@example.com")


class LaboratorySerializerTests(TestCase):
    def setUp(self):
        self.lab = Laboratory.objects.create(
            name="BioLab",
            address="123 Lab St",
            email="lab@example.com",
            phone="12345678",
            url="http://lab.com",
        )

    def test_valid_laboratory(self):
        serializer = LaboratorySerializer(instance=self.lab, context={"request": None})
        data = serializer.data
        self.assertEqual(data["name"], "BioLab")
        self.assertIsNone(data["photo_url"])

    def test_laboratory_with_profile_pic(self):
        img = SimpleUploadedFile("lab.jpg", b"picdata", content_type="image/jpeg")
        lab = Laboratory.objects.create(name="Lab Pic", profile_pic=img)
        
        mock_request = Mock()
        mock_request.build_absolute_uri = lambda path: f"http://testserver{path}"
        
        serializer = LaboratorySerializer(instance=lab, context={"request": mock_request})
        data = serializer.data
        
        self.assertIsNotNone(data["photo_url"])
        self.assertTrue(data["photo_url"].startswith("http://testserver/media/"))
