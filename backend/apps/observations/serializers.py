from rest_framework import serializers

from .models import Observation


class ObservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Observation
        fields = "__all__"

        read_only_fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
        )