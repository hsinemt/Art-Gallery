from rest_framework import serializers
from .models import Reclamation
from .feelings import analyze_feelings
from django.contrib.auth import get_user_model

User = get_user_model()


class UserMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class ReclamationSerializer(serializers.ModelSerializer):
    auteur = UserMinimalSerializer(read_only=True)
    cible = UserMinimalSerializer(read_only=True)
    cible_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='cible',
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Reclamation
        fields = [
            'id',
            'auteur',
            'cible',
            'cible_id',
            'sujet',
            'contenu',
            'sentiment_local',
            'emotions_local',
            'date_creation'
        ]
        read_only_fields = ['id', 'sentiment_local', 'emotions_local', 'date_creation', 'auteur']

    def validate(self, data):
        # Si le sujet est 'user', la cible est obligatoire
        if data.get('sujet') == 'user' and not data.get('cible'):
            raise serializers.ValidationError({
                'cible': 'Une cible est requise pour une réclamation de type utilisateur.'
            })
        
        # Si le sujet est 'system', la cible doit être null
        if data.get('sujet') == 'system':
            data['cible'] = None
        
        return data

    def create(self, validated_data):
        # Calcul automatique des sentiments
        text = validated_data.get('contenu', '')
        analysis = analyze_feelings(text)
        validated_data['sentiment_local'] = analysis['sentiment']
        validated_data['emotions_local'] = analysis['emotions']
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Recalculer les sentiments si le contenu change
        if 'contenu' in validated_data:
            text = validated_data.get('contenu', '')
            analysis = analyze_feelings(text)
            validated_data['sentiment_local'] = analysis['sentiment']
            validated_data['emotions_local'] = analysis['emotions']
        return super().update(instance, validated_data)