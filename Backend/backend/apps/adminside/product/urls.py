from django.urls import path
from .views import ProductView,AddProductView,ProductDetailView,BrandView, BrandDetailView,SizeView, SizeDetailView


urlpatterns = [
    path("products/", ProductView.as_view(), name="products"),
    path("addproducts/", AddProductView.as_view(), name="addProducts"),
    path("products/<int:pk>/", ProductDetailView.as_view(), name="updateProducts"),
    path("brands/", BrandView.as_view(), name="brands"),
    path("brands/<int:pk>/", BrandDetailView.as_view(), name="brand-detail"),
    path("sizes/", SizeView.as_view(), name="sizes"),
    path("sizes/<int:pk>/", SizeDetailView.as_view(), name="size-detail"),
]