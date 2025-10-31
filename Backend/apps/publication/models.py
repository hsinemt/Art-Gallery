from django.db import models
from django.conf import settings


class Publication(models.Model):
    """Represents an artwork publication created by an artist."""

    title = models.CharField(max_length=255, help_text="Nom du tableau")
    creation_date = models.DateField(help_text="Date de création de l'œuvre")

    # Extras utiles
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='publications/', blank=True, null=True)

    artist = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='publications',
        help_text="Artiste auteur de la publication",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title}"


class Comment(models.Model):
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Comment by {self.author} on {self.publication}"

# Create your models here.
