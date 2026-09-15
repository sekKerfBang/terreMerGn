from django.db import models
from django.conf import settings


class Categorie(models.Model):
    class Secteur(models.TextChoices):
        PECHE = "PECHE", "Pêche"
        ELEVAGE = "ELEVAGE", "Élevage"
        AGRICULTURE = "AGRICULTURE", "Agriculture"

    nom = models.CharField(max_length=100)
    secteur = models.CharField(max_length=20, choices=Secteur.choices)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "Catégories"

    def __str__(self):
        return f"{self.nom} ({self.get_secteur_display()})"


class Annonce(models.Model):
    class Statut(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        MODEREE = "MODEREE", "Modérée"
        VENDU = "VENDU", "Vendu"

    class Unite(models.TextChoices):
        KG = "KG", "Kg"
        TONNE = "TONNE", "Tonne"
        PIECE = "PIECE", "Pièce"
        LITRE = "LITRE", "Litre"
        SAC = "SAC", "Sac"
        AUTRE = "AUTRE", "Autre"

    titre = models.CharField(max_length=200)
    description = models.TextField()
    prix = models.PositiveIntegerField(help_text="Prix en GNF")
    quantite = models.PositiveIntegerField(default=1)
    unite = models.CharField(max_length=10, choices=Unite.choices, default=Unite.KG)
    localite = models.CharField(max_length=100)
    image = models.ImageField(upload_to="annonces/", blank=True, null=True)
    statut = models.CharField(max_length=10, choices=Statut.choices, default=Statut.ACTIVE)
    categorie = models.ForeignKey(Categorie, on_delete=models.PROTECT, related_name="annonces")
    auteur = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="annonces")
    cree_le = models.DateTimeField(auto_now_add=True)
    modifie_le = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-cree_le"]

    def __str__(self):
        return self.titre
