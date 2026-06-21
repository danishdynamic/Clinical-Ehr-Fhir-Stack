from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import ClinicalRule
from .serializers import ClinicalRuleSerializer

class ClinicalRuleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows clinical safety rules to be viewed by the UI client.
    """
    serializer_class = ClinicalRuleSerializer
    
    def get_queryset(self):
        # Only deliver constraints marked active in Postgres
        return ClinicalRule.objects.filter(is_active=True).order_by('element_code')