from rest_framework import serializers
from .models import Composition

class CompositionSerializer(serializers.ModelSerializer):
    # Pull the composer's username automatically so the frontend can display it
    composer_name = serializers.ReadOnlyField(source='composer.username')

    class Meta:
        model = Composition
        fields = [
            'id', 
            'patient', 
            'composer', 
            'composer_name', 
            'archetype_id', 
            'template_id', 
            'content', 
            'created_at'
        ]
        # Mark composer as read-only so the frontend doesn't have to pass it
        read_only_fields = ['composer']