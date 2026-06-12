from django.db import models

# Create your models here.

from apps.patients.models import Patient


class Composition(models.Model):

    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="compositions",
    )

    archetype_id = models.CharField(
        max_length=255
    )

    template_id = models.CharField(
        max_length=255
    )

    content = models.JSONField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.template_id