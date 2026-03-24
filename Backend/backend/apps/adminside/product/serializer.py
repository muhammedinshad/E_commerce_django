from rest_framework import serializers
from .models import Product, Brand, Size


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name']


class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'size']


class ProductSerializer(serializers.ModelSerializer):
    brand = serializers.SlugRelatedField(
        queryset=Brand.objects.all(),
        slug_field='name'
    )
    sizes = serializers.SlugRelatedField(
        queryset=Size.objects.all(),
        slug_field='size',
        many=True
    )

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price',
            'brand', 'image', 'stock', 'sizes',
        ]

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0")
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative")
        return value