from rest_framework.routers import (
    DefaultRouter
)

from .views import (
    CompositionViewSet
)

router = DefaultRouter()

router.register(
    "",
    CompositionViewSet,
)

urlpatterns = router.urls