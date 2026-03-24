from django.contrib import admin
from .models import Cart


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display  = ['id', 'user', 'product', 'size', 'quantity', 'created_at']
    list_filter   = ['size', 'created_at']
    search_fields = ['user__email', 'product__name']
    ordering      = ['-created_at']