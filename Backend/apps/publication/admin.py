from django.contrib import admin
from .models import Publication, Comment


@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ("title", "artist", "creation_date", "created_at")
    list_filter = ("creation_date", "artist")
    search_fields = ("title", "artist__username")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("publication", "author", "created_at")
    search_fields = ("publication__title", "author__username", "content")
    list_filter = ("created_at",)
