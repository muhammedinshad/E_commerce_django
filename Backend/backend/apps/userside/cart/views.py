from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart
from .serializer import CartSerializer
from django.db import transaction 


class CartView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:   
            cart_items = Cart.objects.filter(user=request.user)
            serializer = CartSerializer(cart_items, many=True)

            cart_total = round(sum(
                float(item.product.price) * item.quantity for item in cart_items
            ), 2)

            return Response({
                "cart_items": serializer.data,
                "cart_total": cart_total
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e), "place": "CartView.get"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        try:
            with transaction.atomic():
                serializer = CartSerializer(data=request.data)

                if serializer.is_valid():
                    existing = Cart.objects.filter(
                        user=request.user,
                        product=serializer.validated_data['product'],
                        size=serializer.validated_data['size']
                    ).first()

                    if existing:
                        existing.quantity += serializer.validated_data.get('quantity', 1)
                        existing.save()
                        return Response(CartSerializer(existing).data, status=status.HTTP_200_OK)

                    serializer.save(user=request.user)
                    return Response(serializer.data, status=status.HTTP_201_CREATED)

                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {"error": str(e), "place": "CartView.post"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CartDetailView(views.APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            cart_item = Cart.objects.get(pk=pk, user=request.user)
            serializer = CartSerializer(cart_item, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {"error": str(e), "place": "CartDetailView.patch"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, pk):
        try:
            cart_item = Cart.objects.get(pk=pk, user=request.user)
            cart_item.delete()
            return Response(
                {"message": "Item removed from cart"},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e), "place": "CartDetailView.delete"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CartClearView(views.APIView):
    permission_classes = [IsAuthenticated]

    # DELETE clear entire cart
    def delete(self, request):
        try:
            Cart.objects.filter(user=request.user).delete()
            return Response(
                {"message": "Cart cleared"},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e), "place": "CartClearView.delete"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )