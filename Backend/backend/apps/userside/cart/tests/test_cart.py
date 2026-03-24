from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

from apps.adminside.product.models import Product, Brand, Size
from apps.userside.cart.models import Cart


class TestCartAPI(APITestCase):

    def setUp(self):
        User = get_user_model()

        # create user
        self.user = User.objects.create_user(
            username="testuser",
            email="test@test.com",
            password="123456"
        )
        self.client.force_authenticate(user=self.user)

        # Size is IntegerField — use integers only (1=S, 2=M, 3=L)
        self.brand = Brand.objects.create(name="Nike")
        self.size  = Size.objects.create(size=2)   # ✅ integer, not "M"

        self.product = Product.objects.create(
            name        = "Nike Shoe",
            description = "Running shoe",
            price       = 5000,
            brand       = self.brand,
            stock       = 10,
            image       = "https://example.com/shoe.jpg"
        )
        self.product.sizes.add(self.size)

        # urls
        self.cart_url = reverse("cart")

    # -----------------------
    # GET cart
    # -----------------------
    def test_get_cart(self):
        response = self.client.get(self.cart_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("cart_items", response.data)
        self.assertEqual(response.data["cart_items"], [])

    # -----------------------
    # Add item to cart
    # -----------------------
    def test_add_to_cart(self):
        data = {
            "product":  self.product.id,
            "quantity": 2,
            "size":     self.size.id   # ✅ pass size FK id
        }
        response = self.client.post(self.cart_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Cart.objects.count(), 1)

    # -----------------------
    # Add same product again
    # should update quantity
    # -----------------------
    def test_add_same_product_updates_quantity(self):
        # pre-create a cart item with quantity=1
        Cart.objects.create(
            user     = self.user,
            product  = self.product,
            quantity = 1,
            size     = self.size.id   # ✅ integer id
        )

        data = {
            "product":  self.product.id,
            "quantity": 2,
            "size":     self.size.id
        }
        response = self.client.post(self.cart_url, data, format="json")

        cart_item = Cart.objects.first()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(cart_item.quantity, 3)   # 1 + 2 = 3

    # -----------------------
    # Update cart quantity
    # -----------------------
    def test_update_cart_item(self):
        cart_item = Cart.objects.create(
            user     = self.user,
            product  = self.product,
            quantity = 1,
            size     = self.size.id   # ✅ integer id
        )

        url      = reverse("cart-detail", args=[cart_item.id])
        response = self.client.patch(url, {"quantity": 3}, format="json")

        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["quantity"], 3)

    # -----------------------
    # Delete cart item
    # -----------------------
    def test_delete_cart_item(self):
        cart_item = Cart.objects.create(
            user     = self.user,
            product  = self.product,
            quantity = 1,
            size     = self.size.id   # ✅ integer id
        )

        url      = reverse("cart-detail", args=[cart_item.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Cart.objects.count(), 0)

    # -----------------------
    # Clear cart
    # -----------------------
    def test_clear_cart(self):
        Cart.objects.create(
            user     = self.user,
            product  = self.product,
            quantity = 1,
            size     = self.size.id   # ✅ integer id
        )

        url      = reverse("cart-clear")
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Cart.objects.count(), 0)

    # -----------------------
    # Quantity validation
    # -----------------------
    def test_invalid_quantity(self):
        data = {
            "product":  self.product.id,
            "quantity": 0,             # ❌ must be > 0
            "size":     self.size.id
        }
        response = self.client.post(self.cart_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # -----------------------
    # Stock validation
    # -----------------------
    def test_stock_validation(self):
        data = {
            "product":  self.product.id,
            "quantity": 999,           # ❌ stock is only 10
            "size":     self.size.id
        }
        response = self.client.post(self.cart_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)