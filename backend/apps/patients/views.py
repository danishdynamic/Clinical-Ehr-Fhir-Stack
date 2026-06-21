from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q

from .models import Patient
from .serializers import PatientSerializer
from ..users.permissions import IsDoctorOrAdmin
from ..audit_logs.service import create_audit_log

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    
    def get_permissions(self):
        """
        Gates data mutation paths. Only clinical staff or system administrators 
        can execute data writing parameters.
        """
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsDoctorOrAdmin()]
        return [IsAuthenticated()]

    def list(self, request, *args, **kwargs):
        """
        Custom interceptor managing conditional data visibility rules.
        Forces insurers to provide an explicit search parameter.
        """
        user = request.user
        query = request.query_params.get("q", "").strip()

        # Enforce RBAC rules for insurers
        if getattr(user, "role", None) == "INSURER":
            if not query:
                return Response(
                    {"detail": "Global scanning restricted. Insurers must search by explicit Patient Name or ID."},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Use correct database columns tracking first_name and last_name
            queryset = Patient.objects.filter(
                Q(id__iexact=query) |
                Q(mrn__iexact=query) |
                Q(first_name__icontains=query) |
                Q(last_name__icontains=query)
            )
        else:
            # Clinical staff default view (supports optional lookup query filters too)
            queryset = Patient.objects.all()
            if query:
                queryset = queryset.filter(
                    Q(mrn__iexact=query) |
                    Q(first_name__icontains=query) |
                    Q(last_name__icontains=query)
                )

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        patient = serializer.save(created_by=self.request.user)
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