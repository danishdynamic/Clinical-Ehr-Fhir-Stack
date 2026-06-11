from django.shortcuts import render

from django.shortcuts import get_object_or_404

from apps.observations.models import Observation

from .observation_serializers import (
    FHIRObservationSerializer,
)

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
    

class FHIRObservationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, observation_id):
        observation = get_object_or_404(
            Observation,
            pk=observation_id,
        )

        data = FHIRObservationSerializer.to_fhir(
            observation
        )

        return Response(data)  
