from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model

User = get_user_model()


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type', 'is_staff')
    list_filter = ('user_type', 'is_staff', 'is_superuser', 'is_active')

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('user_type', 'bio', 'profile_picture', 'phone_number', 'date_of_birth')}),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('user_type', 'bio', 'phone_number', 'date_of_birth')}),
    )

    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)