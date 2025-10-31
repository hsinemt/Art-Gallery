# apps/rapport/models.py
from django.db import models
from django.conf import settings

class Rapport(models.Model):
    TYPE_CHOICES = [
        ('descriptif', 'Descriptif'),
        ('analyse', 'Analyse'),
        ('evaluation', 'Évaluation'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='rapports')
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    picture = models.ImageField(upload_to='rapports/images/')
    result = models.TextField(blank=True)  # <- facultatif à la création
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.type})"
