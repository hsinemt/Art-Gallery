# apps/rapport/views.py
from rest_framework import viewsets, permissions, parsers
from rest_framework.authentication import TokenAuthentication
from .models import Rapport
from .serializers import RapportSerializer


class RapportViewSet(viewsets.ModelViewSet):
    queryset = Rapport.objects.all()
    serializer_class = RapportSerializer
    # Allow read-only to everyone, creation/update/delete require authentication
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    authentication_classes = [TokenAuthentication]
    # Support multipart form data for image upload
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def perform_create(self, serializer):
        # set the owner/user automatically
        serializer.save(user=self.request.user)
