from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.limitation.permissions import IsAdminOnly
from apps.limitation.pagination import ProductPagination

from apps.userside.order.models import Order
from apps.userside.order.serializer import OrderSerializer

class OrderListAPIView(APIView):
    permission_classes = [IsAdminOnly]
    def get(self, request):
        try:
            orders = Order.objects.all()
            paginator = ProductPagination()
            paginated_order = paginator.paginate_queryset(orders, request)
            serializer = OrderSerializer(paginated_order, many=True)
            
            return paginator.get_paginated_response(serializer.data)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class OrderUpdateAPIView(APIView):
    permission_classes = [IsAdminOnly]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(id=pk)

            serializer = OrderSerializer(order,data=request.data,partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
