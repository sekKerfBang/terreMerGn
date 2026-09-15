from rest_framework import generics, permissions, views, response, status
from django.db.models import Q, Max
from django.contrib.auth import get_user_model
from .models import Message
from .serializers import MessageSerializer

Utilisateur = get_user_model()


class ConversationListView(views.APIView):
    """Liste des interlocuteurs avec le dernier message + non lus."""

    def get(self, request):
        user = request.user
        # Tous les utilisateurs avec qui on a échangé
        partenaires_ids = set(
            Message.objects.filter(Q(expediteur=user) | Q(destinataire=user))
            .values_list("expediteur", flat=True)
        ) | set(
            Message.objects.filter(Q(expediteur=user) | Q(destinataire=user))
            .values_list("destinataire", flat=True)
        )
        partenaires_ids.discard(user.id)

        conversations = []
        for pid in partenaires_ids:
            partenaire = Utilisateur.objects.get(pk=pid)
            dernier = (Message.objects
                       .filter(Q(expediteur=user, destinataire=partenaire)
                               | Q(expediteur=partenaire, destinataire=user))
                       .order_by("-envoye_le").first())
            non_lus = Message.objects.filter(expediteur=partenaire,
                                             destinataire=user, lu=False).count()
            conversations.append({
                "partenaire": {
                    "id": partenaire.id, "username": partenaire.username,
                    "first_name": partenaire.first_name,
                    "last_name": partenaire.last_name,
                    "role": partenaire.get_role_display(),
                    "localite": partenaire.localite,
                },
                "dernier_message": MessageSerializer(dernier).data if dernier else None,
                "non_lus": non_lus,
            })
        conversations.sort(key=lambda c: c["dernier_message"]["envoye_le"]
                           if c["dernier_message"] else "", reverse=True)
        return response.Response(conversations)


class FilConversationView(views.APIView):
    """Messages échangés avec un utilisateur donné."""

    def get(self, request, user_id):
        user = request.user
        fil = Message.objects.filter(
            Q(expediteur=user, destinataire_id=user_id)
            | Q(expediteur_id=user_id, destinataire=user)
        ).select_related("expediteur")
        # Marquer comme lus les messages reçus
        fil.filter(destinataire=user, lu=False).update(lu=True)
        return response.Response(MessageSerializer(fil, many=True).data)


class EnvoyerMessageView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(expediteur=self.request.user)
