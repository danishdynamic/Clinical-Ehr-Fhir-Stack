from django.db import models
from django.conf import settings
from django.utils import timezone

from apps.patients.models import Patient


class Observation(models.Model):
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="observations",
    )

    code = models.CharField(max_length=100)

    value = models.FloatField()

    unit = models.CharField(max_length=20)

    observed_at = models.DateTimeField(default=timezone.now)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.code} - {self.value} {self.unit}"