from django.contrib import admin
from .models import Order, OrderItem

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):    
    list_display = ['id', 'user', 'address', 'status', 'total_price', 'created_at']
    list_filter  = ['status']
    search_fields = ['user__username', 'address']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin): 
    list_display = ['id', 'order', 'product', 'quantity', 'price', 'size']