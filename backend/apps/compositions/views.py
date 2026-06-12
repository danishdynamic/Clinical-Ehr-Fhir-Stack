from django.shortcuts import render

# Create your views here.
from rest_framework.permissions import (
    IsAuthenticated
)

from rest_framework.viewsets import (
    ModelViewSet
)

from .models import Composition

from .serializers import (
    CompositionSerializer
)


class CompositionViewSet(
    ModelViewSet
):

    queryset = Composition.objects.all()

    serializer_class = (
        CompositionSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]