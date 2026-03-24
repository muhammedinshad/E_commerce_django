from django.urls import path
from .views import UsersView,UserUpdateAPIView,DeleteUserAIView

urlpatterns = [
    path("",UsersView.as_view(),name="users"),
    path('update/<int:pk>/', UserUpdateAPIView.as_view(),name="updateUser"),
    path('delete/<int:pk>/', DeleteUserAIView.as_view(),name="deleteuser"),
]