from apps.observations.models import Observation


class FHIRObservationSerializer:
    @staticmethod
    def to_fhir(observation: Observation):
        return {
            "resourceType": "Observation",
            "id": str(observation.pk),
            "status": "final",
            "subject": {
                "reference": f"Patient/{observation.patient.pk}"
            },
            "code": {
                "text": observation.code
            },
            "valueQuantity": {
                "value": observation.value,
                "unit": observation.unit,
            },
            "effectiveDateTime": (
                observation.observed_at.isoformat()
            ),
        }