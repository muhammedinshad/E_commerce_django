from rest_framework.response import Response
from rest_framework import views, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Product, Brand, Size
from .serializer import ProductSerializer,BrandSerializer,SizeSerializer
from django.db.models import Q
from apps.limitation.permissions import IsAdminOnly
from apps.limitation.pagination import ProductPagination

class ProductView(views.APIView):
    permission_classes = [AllowAny]       

    def get(self, request):
        try:
            products = Product.objects.all().order_by('-id')

            search = request.query_params.get('search', None)
            if search:
                products = products.filter(Q(name__icontains=search) | Q(brand__name__icontains=search))

            brand = request.query_params.get('brand', None)
            if brand:
                products = products.filter(brand__name__icontains=brand)

            paginator = ProductPagination()
            paginated_products = paginator.paginate_queryset(products, request)
            serializer = ProductSerializer(paginated_products, many=True)

            return paginator.get_paginated_response(serializer.data)

        except Exception as e:
            return Response(
                {"error": str(e), "place": "ProductView.get"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            

class AddProductView(views.APIView):
    permission_classes = [IsAdminOnly]
    def post(self, request):
        try:
            serializer = ProductSerializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
               {"error": str(e), "place": "ProductView.post"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProductDetailView(views.APIView):
    permission_classes = [AllowAny]  
    
    def get(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
            serializer = ProductSerializer(product)         
            return Response(serializer.data, status=status.HTTP_200_OK) 

        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=status.HTTP_404_NOT_FOUND
            )
         
    def delete(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
            product.delete()
            return Response({"message": "User deleted successfully"},status=status.HTTP_204_NO_CONTENT )
        
        except Product.DoesNotExist:
            return Response(
                {"error": "id not exist"}, 
                status=status.HTTP_404_NOT_FOUND
            )

    def patch(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
            serializer = ProductSerializer(product, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {"error": str(e), "place": "ProductDetailView.patch"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class BrandView(views.APIView):
    permission_classes = [IsAdminOnly]  

    def get(self, request):
        try:
            brands = Brand.objects.all()
            serializer = BrandSerializer(brands, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e), "place": "BrandView.get"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        try:
            many = isinstance(request.data, list)
            serializer = BrandSerializer(data=request.data, many=many)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {"error": str(e), "place": "BrandView.post"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class BrandDetailView(views.APIView):
    permission_classes = [IsAuthenticated]  
    def get(self, request, pk):
        try:
            brand = Brand.objects.get(pk=pk)
            serializer = BrandSerializer(brand)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e), "place": "BrandDetailView.get"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def patch(self, request, pk):
        try:
            brand = Brand.objects.get(pk=pk)
            serializer = BrandSerializer(brand, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {"error": str(e), "place": "BrandDetailView.patch"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ==================== Size ====================
class SizeView(views.APIView):
    permission_classes = [IsAuthenticated]  
    def get(self, request):
        try:
            sizes = Size.objects.all()
            serializer = SizeSerializer(sizes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e), "place": "SizeView.get"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        try:
            many = isinstance(request.data, list)
            serializer = SizeSerializer(data=request.data, many=many)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {"error": str(e), "place": "SizeView.post"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SizeDetailView(views.APIView):
    permission_classes = [IsAuthenticated]   
    def get(self, request, pk):
        try:
            size = Size.objects.get(pk=pk)
            serializer = SizeSerializer(size)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e), "place": "SizeDetailView.get"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def patch(self, request, pk):
        try:
            size = Size.objects.get(pk=pk)
            serializer = SizeSerializer(size, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {"error": str(e), "place": "SizeDetailView.patch"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )