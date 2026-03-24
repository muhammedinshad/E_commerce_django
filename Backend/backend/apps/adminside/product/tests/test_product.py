from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from apps.adminside.product.models import Product, Brand, Size


class TestProductAPI(APITestCase):

    def setUp(self):
        self.brand   = Brand.objects.create(name="Nike")
        self.size    = Size.objects.create(size=2)        # ✅ integer

        self.product = Product.objects.create(
            name        = "Nike Shoe",
            description = "Running shoe",
            price       = 5000,
            brand       = self.brand,
            stock       = 10,
            image       = "https://example.com/shoe.jpg"  # ✅ URL
        )
        self.product.sizes.add(self.size)

    def test_get_products(self):
        url      = reverse("products")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_product(self):
        url  = reverse("products")
        data = {
            "name":        "Adidas Shoe",
            "description": "Sports shoe",
            "price":       4000,
            "brand":       self.brand.name,              
            "stock":       5,
            "sizes":       [self.size.size],            
            "image":       "https://example.com/adidas.jpg"  
        }

        response = self.client.post(url, data, format="json")
        print(response.data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)