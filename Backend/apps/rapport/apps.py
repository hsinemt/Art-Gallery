from django.apps import AppConfig


class RapportConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.rapport'
    def ready(self):
        import apps.rapport.signals