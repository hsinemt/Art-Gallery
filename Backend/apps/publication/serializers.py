from rest_framework import serializers
from .models import Publication


class PublicationSerializer(serializers.ModelSerializer):
    artist_username = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Publication
        fields = [
            'id', 'title', 'creation_date', 'description', 'image',
            'artist', 'artist_username', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'artist']
        extra_kwargs = {
            'artist': {'required': False},
        }

    def validate_artist(self, artist):
        # Ensure assigned artist user has artist role (if ever provided)
        if hasattr(artist, 'user_type') and artist.user_type != 'artist':
            raise serializers.ValidationError("L'utilisateur sélectionné n'est pas un artiste.")
        return artist

    def get_artist_username(self, obj):
        try:
            return getattr(obj.artist, 'username', None)
        except Exception:
            return None

