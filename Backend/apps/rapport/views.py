# apps/rapport/views.py
from rest_framework import viewsets, permissions, parsers
from rest_framework.authentication import TokenAuthentication
from .models import Rapport
from .serializers import RapportSerializer


class RapportViewSet(viewsets.ModelViewSet):
    serializer_class = RapportSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_queryset(self):
        """
        Retourne les rapports de l'utilisateur connecté.
        Si l'utilisateur est admin/superuser, retourne tous les rapports.
        """
        user = self.request.user
        
        # Vérifier si l'utilisateur est admin/superuser
        if user.is_superuser or user.is_staff:
            return Rapport.objects.all().order_by('-created_at')
        
        # Sinon, retourner uniquement les rapports de l'utilisateur
        return Rapport.objects.filter(user=user).order_by('-created_at')

    def perform_create(self, serializer):
        """Définir automatiquement l'utilisateur lors de la création"""
        serializer.save(user=self.request.user)