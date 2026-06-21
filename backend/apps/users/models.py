from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class UserRole(models.TextChoices):
    ADMIN = "ADMIN", "Admin"
    DOCTOR = "DOCTOR", "Doctor"
    NURSE = "NURSE", "Nurse"
    PATIENT = "PATIENT", "Patient"
    AUDITOR = "AUDITOR", "Auditor"
    INSURER = "INSURER", "Insurer"

class User(AbstractUser):
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.PATIENT)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
