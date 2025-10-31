from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('admin', 'Admin'),
        ('artist', 'Artist'),
        ('user', 'Simple User'),
    )

    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='user')
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    # Face recognition fields
    face_encoding = models.JSONField(blank=True, null=True)
    face_image = models.ImageField(upload_to='face_images/', blank=True, null=True)
    face_verified = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Automatically set user_type to 'admin' for superusers
        if self.is_superuser and self.user_type != 'admin':
            self.user_type = 'admin'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"

    def is_artist(self):
        return self.user_type == 'artist'

    def is_simple_user(self):
        return self.user_type == 'user'