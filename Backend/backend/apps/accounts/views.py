from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializer import UserSerializer
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from apps.smtp.smtp import send_welcome_email

from .models import UserModel


class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data)

            if serializer.is_valid():
                user =serializer.save()
                send_welcome_email(user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            token = request.data.get("token")

            if not token:
                return Response(
                    {"error": "Token required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            google_info = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )

            email    = google_info.get("email")
            name     = google_info.get("name", "")
            username = email.split("@")[0]

            user, created = UserModel.objects.get_or_create(
                email    = email,
                defaults = {
                    "username":  username,
                    "role":      "user",
                    "is_active": True,
                }
            )

            if created:
                user.set_unusable_password()
                user.save()

            if not user.is_active:
                return Response(
                    {"error": "Your account has been blocked."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)

            return Response({
                "access":  str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id":           user.id,
                    "email":        user.email,
                    "username":     user.username,
                    "role":         user.role,
                    "is_superuser": user.is_superuser,
                    "is_active":    user.is_active,
                }
            }, status=status.HTTP_200_OK)

        except ValueError:
            return Response(
                {"error": "Invalid Google token"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role" : user.role,
            "is_active":user.is_active
        })


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")

            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            token = RefreshToken(refresh_token)
            token.blacklist()      
            return Response(
                {"message": "Logout successful"},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )