from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from ..audit_logs.models import AuditLog
from ..observations.models import Observation
from ..patients.models import Patient
from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]  # Guarding stats endpoint

    def get(self, request):
        return Response(
            {
                "patients": Patient.objects.count(),
                "observations": Observation.objects.count(),
                "audit_logs": AuditLog.objects.count(),
            }
        )


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully system-wide."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Let SimpleJWT authenticate the credentials and populate self.user
        data = super().validate(attrs)

        # 1. Capture self.user into a variable to isolate the reference
        user = self.user

        # 2. Add an explicit type-guard check to satisfy Pylance that user is not None
        if user is not None:
            data["user_id"] = str(getattr(user, "id", ""))
            data["email"] = getattr(user, "email", "")
            data["first_name"] = getattr(user, "first_name", "")
            data["last_name"] = getattr(user, "last_name", "")
            data["role"] = getattr(user, "role", "UNKNOWN")

        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
