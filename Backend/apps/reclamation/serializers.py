# apps/reclamation/serializers.py
from rest_framework import serializers
from .models import Reclamation
from .feelings import analyze_feelings  # ta fonction locale


class ReclamationSerializer(serializers.ModelSerializer):
    # Do not require the client to send the auteur; use the current authenticated user by default
    auteur = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Reclamation
        fields = '__all__'
        read_only_fields = ['sentiment_local', 'emotions_local', 'date_creation']

    def create(self, validated_data):
        # Calcul automatique des sentiments
        text = validated_data.get('contenu', '')
        analysis = analyze_feelings(text)
        validated_data['sentiment_local'] = analysis['sentiment']
        validated_data['emotions_local'] = analysis['emotions']
        return super().create(validated_data)
