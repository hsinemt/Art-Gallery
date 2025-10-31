# apps/rapport/serializers.py
from rest_framework import serializers
from .models import Rapport
from django.contrib.auth import get_user_model

User = get_user_model()


class UserMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class RapportSerializer(serializers.ModelSerializer):
    user = UserMinimalSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='user',
        write_only=True,
        required=False
    )

    class Meta:
        model = Rapport
        fields = [
            'id',
            'user',
            'user_id',
            'name',
            'type',
            'picture',
            'result',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'user']