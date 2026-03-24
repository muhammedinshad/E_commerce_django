from django.contrib import admin
from .models import Product, Brand, Size

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price']  
    
@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']

@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
    list_display = ['id', 'size']