from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializer import OrderSerializer
from django.db import transaction 
from django.contrib.auth.models import User
from apps.smtp.smtp import send_order_email


class OrderView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            print(f"user : {User}")
            orders = Order.objects.filter(user=request.user).order_by('-created_at')
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e), "place": "OrderView.get"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        try:
            with transaction.atomic():
                serializer = OrderSerializer(data=request.data)

                if serializer.is_valid():
                    order = serializer.save(user=request.user)

                    send_order_email(
                        user_email  = request.user.email,
                        order_id    = order.id,
                        order_items = order.items.all(),   
                        total_price = order.total_price,
                        address     = order.address,
                        username    = request.user.username,
                    )

                    return Response(serializer.data, status=status.HTTP_201_CREATED)

                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print("ORDER ERROR:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OrderDetailView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
            serializer = OrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e), "place": "OrderDetailView.get"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
            serializer = OrderSerializer(order, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {"error": str(e), "place": "OrderDetailView.patch"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )