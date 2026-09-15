from django.db import models
from django.conf import settings


class Message(models.Model):
    expediteur = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                   related_name="messages_envoyes")
    destinataire = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                     related_name="messages_recus")
    annonce = models.ForeignKey("annonces.Annonce", on_delete=models.SET_NULL,
                                null=True, blank=True, related_name="messages")
    contenu = models.TextField()
    lu = models.BooleanField(default=False)
    envoye_le = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["envoye_le"]

    def __str__(self):
        return f"De {self.expediteur} → {self.destinataire}"
