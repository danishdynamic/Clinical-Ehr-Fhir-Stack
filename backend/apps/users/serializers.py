from rest_framework import serializers
from .models import User, UserRole

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "created_at", "updated_at"]

    

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "role"]

    def validate_role(self, value):
        # Prevent registration of highly privileged clinical/admin roles
        protected_roles = [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.AUDITOR]
        
        if value in protected_roles:
            raise serializers.ValidationError(
                "Privileged staff profiles cannot be self-registered."
            )
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            role=validated_data.get("role", UserRole.PATIENT)
        )
        return user