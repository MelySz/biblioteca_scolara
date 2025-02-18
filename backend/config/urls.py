from django.contrib import admin
from django.urls import path, include
from biblioteca_scolara.views import login_view, logout_view
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),  # Acces la Django Admin
    path("api/", include("biblioteca_scolara.urls")),  # Importăm rutele API din biblioteca_scolara
    path("api/login/", login_view, name="login"),
    path("api/logout/", logout_view, name="logout"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
