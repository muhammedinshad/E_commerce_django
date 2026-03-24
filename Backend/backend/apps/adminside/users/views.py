from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.limitation.permissions import IsAdminOnly
from apps.accounts.models import UserModel
from apps.accounts.serializer import UserSerializer


class UsersView(APIView):
    permission_classes = [IsAdminOnly]
    def get(self,request):
        try:
            users = UserModel.objects.all()
            serializer = UserSerializer(users,many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error":str(e)})


class UserUpdateAPIView(APIView):
    permission_classes = [IsAdminOnly]
    def patch(self, request, pk):
        try:
            user = UserModel.objects.get(id=pk)

            serializer = UserSerializer(user,data=request.data,partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except UserModel.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DeleteUserAIView(APIView):
    permission_classes = [IsAdminOnly]        
    def delete(self, request, pk):
        try:
            user = UserModel.objects.get(id=pk)
            user.delete()
            return Response(
                {"message": "User deleted successfully"}, 
                status=status.HTTP_204_NO_CONTENT
            )
        
        except UserModel.DoesNotExist:
            return Response(
                {"error": "User not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )