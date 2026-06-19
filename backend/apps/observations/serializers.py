from rest_framework import serializers

from .models import Observation


class ObservationSerializer(serializers.ModelSerializer):

    patient_name = serializers.SerializerMethodField()
    class Meta:
        model = Observation
        fields = "__all__"

        read_only_fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
        )

    def get_patient_name(self, obj):
        return (f"{obj.patient.first_name} "
            f"{obj.patient.last_name}"
        )