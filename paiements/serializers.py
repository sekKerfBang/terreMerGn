from rest_framework import serializers
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    annonce_titre = serializers.CharField(source="annonce.titre", read_only=True)
    acheteur_nom = serializers.CharField(source="acheteur.username", read_only=True)
    operateur_display = serializers.CharField(source="get_operateur_display", read_only=True)
    statut_display = serializers.CharField(source="get_statut_display", read_only=True)

    class Meta:
        model = Transaction
        fields = "__all__"
        read_only_fields = ["reference", "acheteur", "vendeur", "montant", "statut",
                            "token_gateway", "url_paiement", "reponse_gateway"]