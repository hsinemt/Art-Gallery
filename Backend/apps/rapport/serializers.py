# apps/rapport/serializers.py
from rest_framework import serializers
from .models import Rapport

class RapportSerializer(serializers.ModelSerializer):
    # Set user automatically from request context if not provided
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Rapport
        fields = '__all__'
