from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

User = get_user_model()


class CustomUserModelTests(TestCase):
    """Test suite for CustomUser model creation and role assignments."""

    def setUp(self):
        self.doctor_user = User.objects.create_user(
            username="dr_smith",
            email="dr.smith@hospital.org",
            password="SecurePassword123!",
            role="DOCTOR",
            first_name="Sarah",
            last_name="Smith"
        )

    def test_create_user_with_role(self):
        """Verify custom user attributes and role assignment."""
        self.assertEqual(self.doctor_user.email, "dr.smith@hospital.org")
        self.assertEqual(self.doctor_user.role, "DOCTOR")
        self.assertTrue(self.doctor_user.check_password("SecurePassword123!"))

    def test_create_superuser(self):
        """Verify superuser creation with admin privileges."""
        admin_user = User.objects.create_superuser(
            username="admin_user",
            email="admin@hospital.org",
            password="AdminPassword123!"
        )
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)


class JWTAuthenticationTests(TestCase):
    """Test suite for JWT token obtain endpoint and custom payload claims."""

    def setUp(self):
        self.client = APIClient()
        self.user_password = "DoctorPassword123!"
        self.user = User.objects.create_user(
            username="dr_johnson",
            email="dr.johnson@hospital.org",
            password=self.user_password,
            role="DOCTOR",
            first_name="Alex",
            last_name="Johnson"
        )
        
        self.token_url = "/api/v1/users/auth/token/"

    def test_jwt_token_obtain_success(self):
        """Verify valid login returns access and refresh tokens."""
        payload = {
            "username": "dr_johnson",
            "password": self.user_password
        }
        response = self.client.post(self.token_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_jwt_token_obtain_invalid_credentials(self):
        """Verify invalid credentials return 401 Unauthorized."""
        payload = {
            "username": "dr_johnson",
            "password": "WrongPassword!"
        }
        response = self.client.post(self.token_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)