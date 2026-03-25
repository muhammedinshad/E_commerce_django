from django.urls import path
from .views import RegisterUserView, ProfileView, LogoutView,GoogleLoginView,CustomLoginView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/", RegisterUserView.as_view(), name="register"),
    path("login/", CustomLoginView.as_view(), name="login"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("logout/", LogoutView.as_view(), name="logout"), 
    path("google/", GoogleLoginView.as_view(), name="google-login"),
]