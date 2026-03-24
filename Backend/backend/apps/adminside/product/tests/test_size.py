from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework import status


class TestSizeAPI(APITestCase):

    def setUp(self):
        User = get_user_model()

        self.user = User.objects.create_user(
            username="admin",
            email="admin@test.com",
            password="123456"
        )

        self.client.force_authenticate(user=self.user)

    def test_create_size(self):
        url = reverse("sizes")

        data = {"size": "L"}

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_sizes(self):
        url = reverse("sizes")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)