from django.urls import path
from .views import OrderListAPIView,OrderUpdateAPIView

urlpatterns = [
    path('list/',OrderListAPIView.as_view(),name='orderslist'),
    path('update/<int:pk>/', OrderUpdateAPIView.as_view(),name="orderUpdate"),
]