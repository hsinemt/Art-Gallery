from django.db import models
from django.conf import settings

class Reclamation(models.Model):
    SUJET_CHOICES = [
        ('system', 'Système'),
        ('user', 'Utilisateur'),
    ]

    auteur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reclamations_envoyees'
    )

    cible = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='reclamations_recues'
    )

    sujet = models.CharField(max_length=50, choices=SUJET_CHOICES)
    contenu = models.TextField()

    # Analyse locale
    sentiment_local = models.CharField(max_length=50, blank=True, null=True)
    emotions_local = models.JSONField(blank=True, null=True)

    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Réclamation #{self.id} par {self.auteur}"
