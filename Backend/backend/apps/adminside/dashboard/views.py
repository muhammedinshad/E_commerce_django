from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.limitation.permissions import IsAdminOnly
from apps.accounts.models import UserModel
from apps.adminside.product.models import Product
from apps.userside.order.models import Order
from django.db.models import Sum


class DashboardStatsView(APIView):
    permission_classes = [IsAdminOnly]

    def get(self, request):
        try:
            total_users = UserModel.objects.filter(
                role="user"
            ).count()
            
            total_activeUsers = UserModel.objects.filter(
                is_active=True,role="user"
            ).count()
            
            total_blockUsers = UserModel.objects.filter(
                is_active=False
            ).count()
            
            total_products = Product.objects.count()
            total_activeProducts = Product.objects.filter(stock__gte=1).count()
            total_nonActiveProducts = Product.objects.filter(stock = 0).count()

            total_orders = Order.objects.count()
            total_pendingOrders = Order.objects.filter(status="Pending").count()
            total_confromOrders = Order.objects.filter(status="Confrom").count()
            
            revenue = Order.objects.filter(
                status="Confrom"         
            ).aggregate(
                total=Sum('total_price')
            )['total'] or 0

            return Response({
                "total_users":      total_users,
                "total_activeUsers": total_activeUsers,
                "total_blockUsers" : total_blockUsers,
                "total_products":   total_products,
                "total_activeProducts" :total_activeProducts,
                "total_nonActiveProducts" : total_nonActiveProducts,
                "total_orders":     total_orders,
                "total_pendingOrders" : total_pendingOrders,
                "total_confromOrders" : total_confromOrders,
                "revenue":          float(revenue),
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )