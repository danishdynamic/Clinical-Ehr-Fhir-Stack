from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CurrentUserView, DashboardStatsView, RegisterView, CustomTokenObtainPairView

urlpatterns = [
    path("signup/", RegisterView.as_view(), name="auth_register"), # <-- Added
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", CurrentUserView.as_view()),
    path("dashboard/stats/", DashboardStatsView.as_view()),
]