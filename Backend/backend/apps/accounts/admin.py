from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UserModel


@admin.register(UserModel)
class UserModelAdmin(UserAdmin):
    list_display = ['id', 'username', 'email', 'is_active', 'is_staff', 'date_joined','role']
    list_filter = ['is_active', 'is_staff']
    search_fields = ['username', 'email']
    ordering = ['-date_joined']
    
    fieldsets = (
        ('Login Info',{"fields":("email","username")}),
        ('Role',{"fields":("role",)}),
        ('Permissions',{"fields":('is_active','is_staff','is_superuser','user_permissions')})
    )