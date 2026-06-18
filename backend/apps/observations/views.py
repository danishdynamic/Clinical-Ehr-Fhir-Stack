

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Observation
from .serializers import ObservationSerializer
from ..audit_logs.service import create_audit_log

class ObservationViewSet(viewsets.ModelViewSet):
    queryset = Observation.objects.all()

    serializer_class = ObservationSerializer

    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        observation = serializer.save(
            created_by=self.request.user
        )

        create_audit_log(
            user=self.request.user,
            action="CREATE",
            resource_type="Observation",
            resource_id=observation.pk,
        )

    def perform_update(self, serializer):
        observation = serializer.save()

        create_audit_log(
            user=self.request.user,
            action="UPDATE",
            resource_type="Observation",
            resource_id=observation.pk,
        )

    def perform_destroy(self, instance):

        create_audit_log(
            user=self.request.user,
            action="DELETE",
            resource_type="Observation",
            resource_id=instance.pk,
        )

        instance.delete()

