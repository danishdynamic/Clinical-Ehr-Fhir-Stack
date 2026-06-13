from rest_framework.views import APIView

from rest_framework.response import Response

from apps.compositions.models import (
    Composition
)

class AsyncCompositionListView(
    APIView
):

    async def get(self, request):

        compositions = []

        async for item in (
            Composition.objects.all()
        ):

            compositions.append(
                {
                    "id": item.id,
                    "template": item.template_id,
                }
            )

        return Response(
            compositions
        )