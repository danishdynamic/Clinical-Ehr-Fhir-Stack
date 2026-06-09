from django.shortcuts import render

# Create your views here.
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.patients.models import Patient

from .serializers import FHIRPatientSerializer
from django.shortcuts import get_object_or_404

class FHIRPatientView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, patient_id):
        patient = get_object_or_404(
            Patient,
            id=patient_id,
        )

        data = FHIRPatientSerializer.to_fhir(patient)

        return Response(data)
