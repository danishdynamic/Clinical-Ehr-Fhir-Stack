from django.urls import path

from .views import FHIRPatientView, FHIRObservationView

urlpatterns = [
    path(
        "patient/<int:patient_id>/",
        FHIRPatientView.as_view(),
        name="fhir-patient",
    ),
    path(
        "observation/<int:observation_id>/",
        FHIRObservationView.as_view(),
        name="fhir-observation",
    ),
]