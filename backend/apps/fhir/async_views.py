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
    


# django has inbuild async to sync adapter, so we can use async views without any issues. The only thing is that we need to use the async version of the ORM methods, which are prefixed with 'a'. For example, instead of using get_object_or_404, we can use aget_object_or_404. However, since there is no built-in aget_object_or_404, we can directly use the aget method on the model manager, which will raise a DoesNotExist exception if the object is not found.
# we can also use sync to async adapter to call the sync version of the ORM methods, but it is not recommended as it will block the event loop.
# supppose we have to export large amount of data, then we can use async views to handle the requests concurrently, which will improve the performance of the application.