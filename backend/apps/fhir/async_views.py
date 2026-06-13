import asyncio

from django.shortcuts import  get_object_or_404
from rest_framework.response import  Response
from rest_framework.views import APIView
from apps.patients.models import Patient

from .bundle_serializers import FHIRBundleSerializer

class AsyncFHIRExportView(APIView):

    async def get(
        self,
        request,
        patient_id,
    ):

        await asyncio.sleep(1)

        patient = await Patient.objects.aget(  #.aget is the async version of get_object_or_404
            pk=patient_id
        )

        bundle = (
            FHIRBundleSerializer
            .patient_bundle(patient)
        )

        return Response(bundle)