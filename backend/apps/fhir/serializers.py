from apps.patients.models import Patient


class FHIRPatientSerializer:
    @staticmethod
    def to_fhir(patient: Patient):
        return {
            "resourceType": "Patient",
            "id": str(patient.pk),
            "active": True,
            "identifier": [
                {
                    "system": "urn:mrn",
                    "value": patient.mrn,
                }
            ],
            "name": [
                {
                    "family": patient.last_name,
                    "given": [patient.first_name],
                }
            ],
            "gender": patient.gender,
            "birthDate": patient.date_of_birth.isoformat(),
        }