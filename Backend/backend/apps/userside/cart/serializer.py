from rest_framework import serializers
from .models import Cart

class CartSerializer(serializers.ModelSerializer):
    product_name  = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.CharField(source='product.image', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    total_price   = serializers.SerializerMethodField()

    class Meta:
        model  = Cart
        fields = [
            'id', 'product', 'product_name', 'product_image',
            'product_price', 'quantity', 'size',
            'total_price', 'created_at'
        ]
        read_only_fields = ['user']

    def get_total_price(self, obj):
        return round(float(obj.product.price) * obj.quantity, 2)

    def get_cart_total(self, obj):
        cart_items = Cart.objects.filter(user=obj.user)
        return round(sum(float(item.product.price) * item.quantity for item in cart_items), 2)

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0")
        return value

    def validate(self, data):
        product  = data.get('product') or (self.instance.product if self.instance else None)
        quantity = data.get('quantity', 1)

        if product and quantity > product.stock:  
            raise serializers.ValidationError({
                "quantity": f"Only {product.stock} items in stock"
            })
        return data