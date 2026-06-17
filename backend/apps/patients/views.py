

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Patient
from .serializers import PatientSerializer

from ..audit_logs.service import create_audit_log


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        patient = serializer.save(
            created_by=self.request.user
        )

        create_audit_log(
            user=self.request.user,
            action="CREATE",
            resource_type="Patient",
            resource_id=patient.pk,
        )

    def perform_update(self, serializer):
        patient = serializer.save()

        create_audit_log(
            user=self.request.user,
            action="UPDATE",
            resource_type="Patient",
            resource_id=patient.pk,
        )


    def perform_destroy(self, instance):

        create_audit_log(
            user=self.request.user,
            action="DELETE",
            resource_type="Patient",
            resource_id=instance.pk,
        )

        instance.delete()
