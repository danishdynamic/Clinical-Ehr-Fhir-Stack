from rest_framework.routers import DefaultRouter

from .views import ObservationViewSet

router = DefaultRouter()

router.register(
    "",
    ObservationViewSet,
)

urlpatterns = router.urls