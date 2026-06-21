# apps/compositions/views.py

from rest_framework.permissions import IsAuthenticated
from .models import Composition
from .serializers import CompositionSerializer
from rest_framework import viewsets

class CompositionViewSet(viewsets.ModelViewSet):
    serializer_class = CompositionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Composition.objects.all().order_by('-created_at')
        patient_id = self.request.query_params.get('patient')
        
        # Guard: Only filter if the parameter exists and is a valid numerical digit
        if patient_id and patient_id.isdigit():
            queryset = queryset.filter(patient_id=patient_id)
        elif patient_id == "undefined" or not patient_id:
            # If no valid patient context is found, return everything or none 
            pass 
            
        return queryset

    def perform_create(self, serializer):
        # Automatically inject the logged-in superuser/doctor as the composer
        serializer.save(composer=self.request.user)