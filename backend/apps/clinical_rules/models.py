from django.db import models

# Create your models here.


class ClinicalRule(models.Model):
    SEVERITY_CHOICES = [
        ('normal', 'Normal'),
        ('warning', 'Warning'),
        ('critical', 'Critical'),
    ]

    # Maps directly to an openEHR CKM Archetype
    archetype_id = models.CharField(
        max_length=255, 
        default="openEHR-EHR-OBSERVATION.vital_signs.v1",
        help_text="e.g., openEHR-EHR-OBSERVATION.pulse.v2"
    )
    element_code = models.CharField(
        max_length=100, 
        unique=True, 
        help_text="e.g., heart_rate, body_temperature"
    )
    display_name = models.CharField(max_length=255)
    
    # Validation constraints
    min_value = models.FloatField(null=True, blank=True)
    max_value = models.FloatField(null=True, blank=True)
    unit = models.CharField(max_length=50)
    
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='critical')
    alert_message_template = models.TextField(
        help_text="Custom string token. Use {value} and {bound} for dynamic injection."
    )
    
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.element_code} Constraint ({self.min_value}-{self.max_value} {self.unit})"