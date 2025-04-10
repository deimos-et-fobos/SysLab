from django.test import TestCase
from django.contrib.auth.models import Group, Permission
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils.text import slugify

from .models import CustomUser, UserType, Laboratory, upload_location


class UserTypeModelTests(TestCase):
    def setUp(self):
        self.group = Group.objects.create(name="Test Group")

    def test_create_usertype(self):
        user_type = UserType.objects.create(type="Admin", group=self.group)
        self.assertEqual(str(user_type), "Admin")

    def test_active_usertype_manager(self):
        group1 = Group.objects.create(name="Group1")
        group2 = Group.objects.create(name="Group2")
        UserType.objects.create(type="Activo", group=group1, is_active=True)
        UserType.objects.create(type="Inactivo", group=group2, is_active=False)
        self.assertEqual(UserType.active.count(), 1)


class CustomUserModelTests(TestCase):
    def setUp(self):
        self.group = Group.objects.create(name="Grupo Médicos")
        self.user_type = UserType.objects.create(type="Médico", group=self.group)
    
    def test_create_user(self):
        user = CustomUser.objects.create_user(email="test@example.com", password="pass1234")
        self.assertEqual(user.email, "test@example.com")
        self.assertTrue(user.check_password("pass1234"))
        self.assertFalse(user.is_staff)

    def test_create_superuser(self):
        admin = CustomUser.objects.create_superuser(email="admin@example.com", password="admin123")
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.is_staff)

    def test_create_user_without_email_raises_error(self):
        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(email=None, password="nopass")

    def test_assign_group_from_usertype_signal(self):
        user = CustomUser.objects.create_user(
            email="grouped@example.com", password="123456", type=self.user_type
        )
        self.assertIn(self.group, user.groups.all())

    def test_remove_group_if_usertype_is_none(self):
        user = CustomUser.objects.create_user(
            email="nogroup@example.com", password="123456", type=self.user_type
        )
        user.type = None
        user.save()
        self.assertEqual(user.groups.count(), 0)

    def test_full_name_property(self):
        user = CustomUser.objects.create_user(
            email="name@example.com", password="1234", first_name="Ana", last_name="Pérez"
        )
        self.assertEqual(user.full_name, "Ana Pérez")

    def test_upload_location_for_customuser(self):
        user = CustomUser(email="photo@example.com")
        filename = "profile.jpg"
        expected_path = f"users/img/{slugify(user.email)}"
        self.assertEqual(upload_location(user, filename), expected_path)


class LaboratoryModelTests(TestCase):
    def test_create_laboratory(self):
        lab = Laboratory.objects.create(name="Lab Uno", slug="lab-uno")
        self.assertEqual(str(lab), "Lab Uno")
        self.assertEqual(lab.slug, "lab-uno")

    def test_auto_slug_generation_on_save(self):
        lab = Laboratory.objects.create(name="Laboratorio Central")
        self.assertEqual(lab.slug, slugify("Laboratorio Central"))

    def test_active_laboratory_manager(self):
        Laboratory.objects.create(name="Activo", slug="activo", is_active=True)
        Laboratory.objects.create(name="Inactivo", slug="inactivo", is_active=False)
        self.assertEqual(Laboratory.active.count(), 1)

    def test_upload_location_for_laboratory(self):
        lab = Laboratory(name="MicroLab")
        filename = "logo.png"
        expected_path = f"labs/img/{slugify(lab.name)}"
        self.assertEqual(upload_location(lab, filename), expected_path)


class PermissionTests(TestCase):
    def test_custom_permissions_exist(self):
        permissions = Permission.objects.filter(codename__in=["list_customuser", "list_usertype"])
        self.assertEqual(permissions.count(), 2)
