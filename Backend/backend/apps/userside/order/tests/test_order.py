from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

from apps.adminside.product.models import Product, Brand, Size
from apps.userside.order.models import Order, OrderItem


class TestOrderAPI(APITestCase):

    def setUp(self):
        User = get_user_model()

        # create & authenticate user
        self.user = User.objects.create_user(
            username="testuser",
            email="test@test.com",
            password="123456"
        )
        self.client.force_authenticate(user=self.user)

        # product fixtures
        self.brand   = Brand.objects.create(name="Nike")
        self.size    = Size.objects.create(size=2)       # IntegerField → integer

        self.product = Product.objects.create(
            name        = "Nike Shoe",
            description = "Running shoe",
            price       = 5000,
            brand       = self.brand,
            stock       = 10,
            image       = "https://example.com/shoe.jpg"
        )
        self.product.sizes.add(self.size)

        # url
        self.order_url = reverse("orders")

    # -------------------------------------------------------
    # valid order payload helper
    # -------------------------------------------------------
    def _valid_payload(self):
        return {
            "address":     "123 Test Street, Kerala",
            "total_price": 10000,
            "items": [
                {
                    "product":  self.product.id,
                    "quantity": 2,
                    "price":    5000,
                    "size":     self.size.id
                }
            ]
        }

    # -------------------------------------------------------
    # GET /orders/
    # -------------------------------------------------------
    def test_get_orders_empty(self):
        """Fresh user has no orders."""
        response = self.client.get(self.order_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_get_orders_returns_user_orders(self):
        """GET returns only the current user's orders."""
        order = Order.objects.create(
            user        = self.user,
            address     = "Test Address",
            total_price = 5000
        )
        OrderItem.objects.create(
            order    = order,
            product  = self.product,
            quantity = 1,
            price    = 5000,
            size     = self.size.id
        )

        response = self.client.get(self.order_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["address"], "Test Address")

    def test_get_orders_unauthenticated(self):
        """Unauthenticated request must be rejected."""
        self.client.force_authenticate(user=None)
        response = self.client.get(self.order_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # -------------------------------------------------------
    # POST /orders/  — create order
    # -------------------------------------------------------
    def test_create_order_success(self):
        """Valid payload creates an order with items."""
        response = self.client.post(
            self.order_url, self._valid_payload(), format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 1)
        self.assertEqual(OrderItem.objects.count(), 1)

    def test_create_order_saves_correct_user(self):
        """Order must be linked to the authenticated user."""
        self.client.post(self.order_url, self._valid_payload(), format="json")

        order = Order.objects.first()
        self.assertEqual(order.user, self.user)

    def test_create_order_with_multiple_items(self):
        """Order can contain multiple items."""
        product2 = Product.objects.create(
            name        = "Adidas Shoe",
            description = "Sport shoe",
            price       = 3000,
            brand       = self.brand,
            stock       = 5,
            image       = "https://example.com/adidas.jpg"
        )

        payload = {
            "address":     "456 Test Road, Kerala",
            "total_price": 13000,
            "items": [
                {"product": self.product.id, "quantity": 2, "price": 5000, "size": self.size.id},
                {"product": product2.id,     "quantity": 1, "price": 3000, "size": self.size.id},
            ]
        }
        response = self.client.post(self.order_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(OrderItem.objects.count(), 2)

    def test_create_order_default_status_is_pending(self):
        """Newly created order status must default to Pending."""
        self.client.post(self.order_url, self._valid_payload(), format="json")

        order = Order.objects.first()
        self.assertEqual(order.status, "Pending")

    def test_create_order_missing_address(self):
        """Order without address must return 400."""
        payload = self._valid_payload()
        del payload["address"]

        response = self.client.post(self.order_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("address", response.data)

    def test_create_order_missing_items(self):
        """Order without items must return 400."""
        payload = self._valid_payload()
        del payload["items"]

        response = self.client.post(self.order_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("items", response.data)

    def test_create_order_empty_items(self):
        """Order with empty items list must return 400."""
        payload          = self._valid_payload()
        payload["items"] = []

        response = self.client.post(self.order_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_order_unauthenticated(self):
        """Unauthenticated user cannot create an order."""
        self.client.force_authenticate(user=None)
        response = self.client.post(self.order_url, self._valid_payload(), format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_orders_isolated_between_users(self):
        """User A cannot see User B's orders."""
        User = get_user_model()
        other_user = User.objects.create_user(
            username="other", email="other@test.com", password="123456"
        )
        Order.objects.create(
            user        = other_user,
            address     = "Other Address",
            total_price = 5000
        )

        # current user should see 0 orders
        response = self.client.get(self.order_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)