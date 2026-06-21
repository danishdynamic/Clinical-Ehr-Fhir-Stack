from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClinicalRuleViewSet

router = DefaultRouter()
router.register(r'clinical-rules', ClinicalRuleViewSet, basename='clinicalrule')

urlpatterns = [
    path('', include(router.urls)),
]