from django.conf import settings
from django.db import models


class Transaction(models.Model):
    class Operateur(models.TextChoices):
        ORANGE_MONEY = "ORANGE_MONEY", "Orange Money"
        MTN_MOMO = "MTN_MOMO", "MTN Mobile Money"
        BANCAIRE = "BANCAIRE", "Virement bancaire"

    class Statut(models.TextChoices):
        INITIEE = "INITIEE", "Initiée"
        EN_ATTENTE = "EN_ATTENTE", "En attente"
        REUSSIE = "REUSSIE", "Réussie"
        ECHOUEE = "ECHOUEE", "Échouée"
        ANNULEE = "ANNULEE", "Annulée"

    reference = models.CharField(max_length=30, unique=True, editable=False)
    annonce = models.ForeignKey("annonces.Annonce", on_delete=models.PROTECT, related_name="transactions")
    acheteur = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="achats")
    vendeur = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="ventes")
    quantite = models.PositiveIntegerField(default=1)
    montant = models.DecimalField(max_digits=15, decimal_places=0)  # GNF
    operateur = models.CharField(max_length=20, choices=Operateur.choices)
    telephone_client = models.CharField(max_length=20, blank=True)
    token_gateway = models.CharField(max_length=120, blank=True)
    url_paiement = models.URLField(blank=True)
    statut = models.CharField(max_length=20, choices=Statut.choices, default=Statut.INITIEE)
    reponse_gateway = models.JSONField(default=dict, blank=True)
    cree_le = models.DateTimeField(auto_now_add=True)
    maj_le = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-cree_le"]

    def save(self, *args, **kwargs):
        if not self.reference:
            import uuid
            self.reference = f"TMG-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.reference} · {self.get_operateur_display()} · {self.montant} GNF"