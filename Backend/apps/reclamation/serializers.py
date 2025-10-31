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

    def to_representation(self, instance):
        """
        Customize output - only admins can see sentiment fields
        """
        representation = super().to_representation(instance)
        request = self.context.get('request')
        
        # If user is not admin, remove sentiment fields
        if request and hasattr(request, 'user'):
            user = request.user
            if not (user.is_staff or user.is_superuser):
                representation.pop('sentiment_local', None)
                representation.pop('emotions_local', None)
        
        return representation

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
        # Calcul automatique des sentiments avec analyse complète
        text = validated_data.get('contenu', '')
        analysis = analyze_feelings(text)
        
        # Store sentiment
        validated_data['sentiment_local'] = analysis['sentiment']
        
        # Store detailed emotions data
        emotions_data = {
            'risk_level': analysis.get('risk_level', 'MINIMAL'),
            'risk_score': analysis.get('risk_score', 0),
            'positive_score': analysis.get('positive_score', 0),
            'negative_score': analysis.get('negative_score', 0),
            'emotions': []
        }
        
        # Get all detected emotions sorted by intensity
        if analysis.get('emotions'):
            sorted_emotions = sorted(
                analysis['emotions'].items(),
                key=lambda x: x[1]['intensity'],
                reverse=True
            )
            
            for emotion, data in sorted_emotions:
                emotions_data['emotions'].append({
                    'name': emotion,
                    'intensity': data['intensity'],
                    'count': data['count'],
                    'severity': data.get('severity', 1),
                    'keywords': data.get('keywords', [])[:5]  # Limit to 5 keywords
                })
        
        validated_data['emotions_local'] = emotions_data
        
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Recalculer les sentiments si le contenu change
        if 'contenu' in validated_data:
            text = validated_data.get('contenu', '')
            analysis = analyze_feelings(text)
            
            validated_data['sentiment_local'] = analysis['sentiment']
            
            # Store detailed emotions data
            emotions_data = {
                'risk_level': analysis.get('risk_level', 'MINIMAL'),
                'risk_score': analysis.get('risk_score', 0),
                'positive_score': analysis.get('positive_score', 0),
                'negative_score': analysis.get('negative_score', 0),
                'emotions': []
            }
            
            if analysis.get('emotions'):
                sorted_emotions = sorted(
                    analysis['emotions'].items(),
                    key=lambda x: x[1]['intensity'],
                    reverse=True
                )
                
                for emotion, data in sorted_emotions:
                    emotions_data['emotions'].append({
                        'name': emotion,
                        'intensity': data['intensity'],
                        'count': data['count'],
                        'severity': data.get('severity', 1),
                        'keywords': data.get('keywords', [])[:5]
                    })
            
            validated_data['emotions_local'] = emotions_data
        
        return super().update(instance, validated_data)