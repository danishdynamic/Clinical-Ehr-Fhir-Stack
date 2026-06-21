from apps.patients.models import Patient

from .serializers import (FHIRPatientSerializer)

from .observation_serializers import (FHIRObservationSerializer)

class FHIRBundleSerializer:

    @staticmethod
    def patient_bundle(patient: Patient):
        entries = []

        entries.append({
            "resource": FHIRPatientSerializer.to_fhir(patient)
        })

       
        for obs in patient.observations.all():  # type: ignore
            entries.append({
                "resource": FHIRObservationSerializer.to_fhir(obs)
            })

        return {
            "resourceType": "Bundle",
            "type": "collection",
            "entry": entries,
        }