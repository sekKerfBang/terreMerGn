from django.contrib.auth.models import AbstractUser
from django.db import models


class Utilisateur(AbstractUser):
    class Role(models.TextChoices):
        PECHEUR = "PECHEUR", "Pêcheur"
        ELEVEUR = "ELEVAGE", "Éleveur"
        AGRICULTEUR = "AGRICULTURE", "Agriculteur"
        ACHETEUR = "ACHETEUR", "Acheteur"

    telephone = models.CharField("Téléphone", max_length=20, blank=True)
    localite = models.CharField("Localité", max_length=100, blank=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.ACHETEUR)
    bio = models.TextField("Bio", blank=True)

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"
