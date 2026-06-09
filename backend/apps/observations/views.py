from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Observation
from .serializers import ObservationSerializer


class ObservationViewSet(viewsets.ModelViewSet):
    queryset = Observation.objects.all()

    serializer_class = ObservationSerializer

    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user
        )