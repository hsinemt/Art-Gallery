from rest_framework import generics, permissions
from rest_framework.authentication import TokenAuthentication
from .models import Reclamation
from .serializers import ReclamationSerializer


class ReclamationListCreateView(generics.ListCreateAPIView):
    queryset = Reclamation.objects.all().order_by('-date_creation')
    serializer_class = ReclamationSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def perform_create(self, serializer):
        serializer.save(auteur=self.request.user)


class ReclamationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reclamation.objects.all()
    serializer_class = ReclamationSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]


class ReclamationReceivedView(generics.ListAPIView):
    serializer_class = ReclamationSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        return Reclamation.objects.filter(cible=self.request.user).order_by('-date_creation')


class ReclamationSentView(generics.ListAPIView):
    serializer_class = ReclamationSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        return Reclamation.objects.filter(auteur=self.request.user).order_by('-date_creation')
