from rest_framework import viewsets, permissions
from rest_framework.permissions import SAFE_METHODS
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Publication, Comment
from .serializers import PublicationSerializer, CommentSerializer
from .utils import generate_image_from_description
from .utils_ai import summarize_text


class IsArtistOrReadOnly(permissions.BasePermission):
    """Read for all, write only for authenticated artists."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        if not request.user or not request.user.is_authenticated:
            return False
        # requires users.User with user_type field
        return getattr(request.user, 'user_type', None) == 'artist'


class PublicationViewSet(viewsets.ModelViewSet):
    queryset = Publication.objects.select_related('artist').all()
    serializer_class = PublicationSerializer
    permission_classes = [IsArtistOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        artist_id = self.request.query_params.get('artist')
        if artist_id:
            try:
                qs = qs.filter(artist_id=artist_id)
            except Exception:
                pass
        return qs

    @action(detail=True, methods=['get'], url_path='comments')
    def list_comments(self, request, pk=None):
        publication = self.get_object()
        comments = publication.comments.select_related('author').all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        # Default artist to current user if not provided
        artist = serializer.validated_data.get('artist') or self.request.user
        image = serializer.validated_data.get('image')
        description = serializer.validated_data.get('description')

        if image is None and description:
            content = generate_image_from_description(description)
            if content is not None:
                # Save with a deterministic filename seed
                instance = serializer.save(artist=artist)
                filename = f"generated_{instance.pk}.png"
                instance.image.save(filename, content, save=True)
                return

        serializer.save(artist=artist)

    def perform_update(self, serializer):
        # Track original description and image state before saving
        existing_instance = self.get_object()
        original_description = existing_instance.description
        had_image = bool(existing_instance.image)

        instance = serializer.save()

        # Determine if description changed
        description_changed = instance.description != original_description

        # Regenerate if description changed; otherwise generate if no image but description exists
        should_generate = description_changed or (not had_image and bool(instance.description))
        if should_generate and instance.description:
            content = generate_image_from_description(instance.description)
            if content is not None:
                filename = f"generated_{instance.pk}.png"
                instance.image.save(filename, content, save=True)


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return getattr(obj, 'author_id', None) == getattr(request.user, 'id', None)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.select_related('author', 'publication').all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        publication_id = self.request.query_params.get('publication')
        if publication_id:
            qs = qs.filter(publication_id=publication_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request):
        publication_id = request.query_params.get('publication')
        if not publication_id:
            return Response({'detail': 'publication param is required'}, status=400)
        comments = Comment.objects.filter(publication_id=publication_id).order_by('-created_at')[:50]
        text = "\n".join([c.content for c in comments])
        result = summarize_text(text)
        if not result:
            return Response({'summary': None, 'detail': 'AI not configured'}, status=200)
        return Response({'summary': result}, status=200)
