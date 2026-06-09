from django.urls import path

from .views import FHIRPatientView

urlpatterns = [
    path(
        "patient/<int:patient_id>/",
        FHIRPatientView.as_view(),
        name="fhir-patient",
    ),
]