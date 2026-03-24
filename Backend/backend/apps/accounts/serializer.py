from rest_framework import serializers
from .models import UserModel

class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
                                                                
    class Meta:
        model = UserModel
        fields = [
            "id", "username", "email", "password", 
            "confirm_password", "is_active", "date_joined","role"
        ]
        

    def validate(self, data):
        if "password" in data or "confirm_password" in data:
            password = data.get("password")
            confirm_password = data.get("confirm_password")

            if password != confirm_password:
                raise serializers.ValidationError({
                    "confirm_password": "Passwords do not match"
                })
            
        return data

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters")
        return value

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        user = UserModel.objects.create_user(**validated_data)
        return user