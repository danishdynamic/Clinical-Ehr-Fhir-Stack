from django.db import models
from django.conf import settings 
from apps.patients.models import Patient


class Composition(models.Model):
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="compositions",
    )
    
    # 1. Added Composer for clinical auditing and ownership
    composer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,  # Protect prevents deleting users if they have signed medical documents
        related_name="authored_compositions",
    )

    archetype_id = models.CharField(
        max_length=255
    )

    template_id = models.CharField(
        max_length=255
    )

    # 2. Added default and blank rules for easier draft savings
    content = models.JSONField(
        default=dict, 
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    # 3. Enhanced for immediate scannability in Django Admin logs
    def __str__(self):
        # Protects against Pylance missing Django's automatic _id suffix property
        patient_id = getattr(self, "patient_id", "Unknown")
        
        # Format the timestamp safely if created_at is available
        date_str = self.created_at.strftime('%Y-%m-%d') if self.created_at else "Draft"
        
        return f"{self.template_id} - Patient #{patient_id} ({date_str})"