from django.urls import path
from .views import CartView, CartDetailView, CartClearView

urlpatterns = [
    path('',         CartView.as_view(),      name='cart'),
    path('<int:pk>/', CartDetailView.as_view(), name='cart-detail'),
    path('clear/',   CartClearView.as_view(),  name='cart-clear'),
]