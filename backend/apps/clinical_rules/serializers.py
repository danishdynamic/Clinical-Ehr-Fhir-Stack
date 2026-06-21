from rest_framework import serializers
from .models import ClinicalRule

class ClinicalRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicalRule
        fields = [
            'element_code', 
            'display_name', 
            'min_value', 
            'max_value', 
            'unit', 
            'alert_message_template',
            'severity'
        ]