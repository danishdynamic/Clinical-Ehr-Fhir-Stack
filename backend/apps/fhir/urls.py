from django.urls import path

from .async_views import AsyncFHIRExportView

from .views import FHIRPatientBundleView, FHIRPatientView, FHIRObservationView

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
    path(
        "patient/<int:patient_id>/bundle/",
        FHIRPatientBundleView.as_view(),
        name="fhir-patient-bundle",
    ),
    path(
    "export/patient/<int:patient_id>/",
    AsyncFHIRExportView.as_view(),
),
]