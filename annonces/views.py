from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Annonce, Categorie
from .serializers import AnnonceListSerializer, AnnonceDetailSerializer, CategorieSerializer
from .permissions import IsAuteurOrReadOnly


class CategorieViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    filterset_fields = ["secteur"]


class AnnonceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuteurOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["statut", "categorie__secteur", "categorie", "localite"]
    search_fields = ["titre", "description"]
    ordering_fields = ["prix", "cree_le"]
    ordering = ["-cree_le"]

    def get_queryset(self):
        qs = Annonce.objects.select_related("categorie", "auteur")
        if self.request.user.is_staff:
            return qs

        # Tout le monde voit les annonces actives ; l'auteur voit aussi les siennes
        if self.request.user.is_authenticated:
            return qs.filter(statut="ACTIVE") | qs.filter(auteur=self.request.user)
        return qs.filter(statut="ACTIVE")

    def get_serializer_class(self):
        if self.action == "list":
            return AnnonceListSerializer
        return AnnonceDetailSerializer

    def perform_create(self, serializer):
        serializer.save(auteur=self.request.user)
