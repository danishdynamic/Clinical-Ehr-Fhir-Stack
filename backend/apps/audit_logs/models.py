from django.db import models

# Create your models here.
# apps/audit_logs/models.py

from django.conf import settings


class AuditLog(models.Model):

    class Action(models.TextChoices):
        CREATE = "CREATE", "Create"
        READ = "READ", "Read"
        UPDATE = "UPDATE", "Update"
        DELETE = "DELETE", "Delete"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
    )

    action = models.CharField(
        max_length=20,
        choices=Action.choices,
    )

    resource_type = models.CharField(
        max_length=100,
    )

    resource_id = models.CharField(
        max_length=100,
    )

    timestamp = models.DateTimeField(
        auto_now_add=True,
    )

    metadata = models.JSONField(
        default=dict,
        blank=True,
    )

    def __str__(self):
        return (
            f"{self.user} "
            f"{self.action} "
            f"{self.resource_type}"
        )