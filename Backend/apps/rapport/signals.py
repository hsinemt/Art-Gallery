from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Rapport

@receiver(post_save, sender=Rapport)
def generate_report(sender, instance, created, **kwargs):
    if created and instance.picture:
        # Import ici pour ne pas bloquer les migrations
        from .utils.image_analysis import analyze_image

        try:
            # Génère le rapport automatiquement
            analysis_result = analyze_image(instance.picture.path)

            # Mets à jour le champ 'result' du modèle
            instance.result = analysis_result["report_text"]
            instance.save(update_fields=['result'])

        except Exception as e:
            print(f"⚠️ Erreur lors de la génération du rapport : {e}")
