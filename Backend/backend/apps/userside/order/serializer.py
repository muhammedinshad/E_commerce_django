from rest_framework import serializers
from .models import Order, OrderItem
from apps.adminside.product.models import Product
from apps.accounts.models import UserModel

class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.SlugRelatedField(queryset=Product.objects.all(),slug_field='name')
    status = serializers.CharField(source='order.status', read_only=True)
    class Meta:
        model = OrderItem
        fields = ["product", "quantity", "price","size","status"]

class OrderSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(queryset=UserModel.objects.all(),slug_field='username')
    items = OrderItemSerializer(many=True)

    class Meta:
        model  = Order
        fields = ["id", "user", "address", "status", "total_price", "items", "created_at"]
        read_only_fields = ["created_at","user"]

    def validate_items(self, value):
        if len(value) == 0:            
            raise serializers.ValidationError("Order must have at least one item.")
        return value

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        order = Order.objects.create(**validated_data)

        for item in items_data:
            product  = item['product']
            quantity = item['quantity']
            
            if product.stock < quantity:
                raise serializers.ValidationError({
                "stock": f"Only {product.stock} items available for {product.name}"
                })
            product.stock -= quantity
            product.save()    
                
            OrderItem.objects.create(order=order, **item)

        return order