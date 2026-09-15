from rest_framework import serializers
from .models import Annonce, Categorie
from accounts.serializers import UtilisateurSerializer


class CategorieSerializer(serializers.ModelSerializer):
    secteur_display = serializers.CharField(source="get_secteur_display", read_only=True)

    class Meta:
        model = Categorie
        fields = ["id", "nom", "secteur", "secteur_display", "description"]


class AnnonceListSerializer(serializers.ModelSerializer):
    categorie_nom = serializers.CharField(source="categorie.nom", read_only=True)
    secteur = serializers.CharField(source="categorie.secteur", read_only=True)
    auteur_username = serializers.CharField(source="auteur.username", read_only=True)

    class Meta:
        model = Annonce
        fields = ["id", "titre", "prix", "quantite", "unite", "localite",
                  "image", "statut", "categorie_nom", "secteur",
                  "auteur_username", "cree_le"]


class AnnonceDetailSerializer(serializers.ModelSerializer):
    categorie = CategorieSerializer(read_only=True)
    categorie_id = serializers.PrimaryKeyRelatedField(
        queryset=Categorie.objects.all(), source="categorie", write_only=True)
    auteur = UtilisateurSerializer(read_only=True)

    class Meta:
        model = Annonce
        fields = ["id", "titre", "description", "prix", "quantite", "unite",
                  "localite", "image", "statut", "categorie", "categorie_id",
                  "auteur", "cree_le"]
