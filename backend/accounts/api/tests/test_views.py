from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from accounts.models import CustomUser, UserType
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

class AuthTests(APITestCase):
    def setUp(self):
        self.password = "StrongPass123"
        self.user = CustomUser.objects.create_user(
            email="test@example.com", password=self.password, is_active=True
        )
        self.login_url = reverse("accounts-api:login")  # asegúrate de tener un nombre de ruta "login"

    def test_login_success(self):
        response = self.client.post(self.login_url, {"email": self.user.email, "password": self.password})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.data)

    def test_login_fail(self):
        response = self.client.post(self.login_url, {"email": self.user.email, "password": "wrong"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logout_success(self):
        refresh = RefreshToken.for_user(self.user)
        self.client.force_authenticate(user=self.user)
        response = self.client.post(reverse("accounts-api:logout"), HTTP_X_REFRESH=str(refresh))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class UserViewTests(APITestCase):
    def setUp(self):
        self.password = "adminpass"
        self.admin = CustomUser.objects.create_superuser(email="admin@example.com", password=self.password)
        self.client.force_authenticate(user=self.admin)

        self.user_type = UserType.objects.create(type="basic")
        self.user = CustomUser.objects.create_user(
            email="user@example.com", first_name="Test", last_name="CustomUser", type=self.user_type, is_active=True, password=self.password
        )

    def test_list_users(self):
        response = self.client.get(reverse("accounts-api:user-list"))  # nombre en tus urls.py
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_user(self):
        response = self.client.get(reverse("accounts-api:user-detail", args=[self.user.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user.email)

    def test_update_user(self):
        response = self.client.put(reverse("accounts-api:user-detail", args=[self.user.id]), {
            "email": self.user.email,
            "first_name": "Updated",
            "last_name": "CustomUser",
            "type": self.user_type.type
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "Updated")

    def test_delete_user_sets_inactive(self):
        response = self.client.delete(reverse('accounts-api:user-detail', args=[self.user.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.user.refresh_from_db()
        self.assertFalse(self.user.is_active)

class CheckPermsTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(email="perms@example.com", password="1234", is_active=True)
        self.client.force_authenticate(user=self.user)

    def test_check_perms(self):
        response = self.client.get(reverse("accounts-api:check-perms") + "?entity=user")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("has_perms", response.data)
