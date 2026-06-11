

# Create your views here.
from rest_framework.viewsets import ReadOnlyModelViewSet

from .models import AuditLog
from .serializers import AuditLogSerializer
from apps.users.permissions import (
    IsAuditorOrAdmin,
)


class AuditLogViewSet(ReadOnlyModelViewSet):

    queryset = AuditLog.objects.all().order_by(
        "-timestamp"
    )

    serializer_class = AuditLogSerializer

    permission_classes = [
        IsAuditorOrAdmin,
    ]