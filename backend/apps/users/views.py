

# Create your views here.
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..audit_logs.models import AuditLog
from ..observations.models import Observation
from ..patients.models import Patient

from .serializers import UserSerializer


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class DashboardStatsView(APIView):

    def get(self, request):

        return Response({
            "patients":
                Patient.objects.count(),

            "observations":
                Observation.objects.count(),

            "audit_logs":
                AuditLog.objects.count(),
        })