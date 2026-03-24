from django.db import models
from apps.accounts.models import UserModel
from apps.adminside.product.models import Product


class Order(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    address = models.TextField()
    status = models.CharField(max_length=50, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    size = models.IntegerField(null=True, blank=True)