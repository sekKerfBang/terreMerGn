from rest_framework import serializers
from .models import Message
from accounts.serializers import UtilisateurSerializer


class MessageSerializer(serializers.ModelSerializer):
    expediteur = UtilisateurSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ["id", "expediteur", "destinataire", "annonce", "contenu",
                  "lu", "envoye_le"]
        read_only_fields = ["expediteur", "lu", "envoye_le"]
