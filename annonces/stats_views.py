from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.contrib.auth import get_user_model
from django.db.models import Count
from .models import Annonce, Categorie

Utilisateur = get_user_model()


class StatsDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({
            "total_utilisateurs": Utilisateur.objects.count(),
            "utilisateurs_par_role": {
                r.label: Utilisateur.objects.filter(role=r.value).count()
                for r in Utilisateur.Role
            },
            "total_annonces": Annonce.objects.count(),
            "annonces_par_statut": {
                s.label: Annonce.objects.filter(statut=s.value).count()
                for s in Annonce.Statut
            },
            "annonces_par_secteur": dict(
                Categorie.objects.values("secteur")
                .annotate(n=Count("annonces"))
                .values_list("secteur", "n")
            ),
            "derniers_utilisateurs": list(
                Utilisateur.objects.order_by("-date_joined")[:5]
                .values("id", "username", "role", "date_joined")
            ),
        })
