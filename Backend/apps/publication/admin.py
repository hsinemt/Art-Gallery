from django.contrib import admin
from .models import Publication


@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ("title", "artist", "creation_date", "created_at")
    list_filter = ("creation_date", "artist")
    search_fields = ("title", "artist__username")
