from django.contrib import admin
from .models import Annonce, Categorie


@admin.register(Categorie)
class CategorieAdmin(admin.ModelAdmin):
    list_display = ["nom", "secteur"]
    list_filter = ["secteur"]


@admin.register(Annonce)
class AnnonceAdmin(admin.ModelAdmin):
    list_display = ["titre", "categorie", "prix", "localite", "statut", "auteur", "cree_le"]
    list_filter = ["statut", "categorie__secteur", "localite"]
    search_fields = ["titre", "description", "auteur__username"]
    actions = ["moderer", "activer"]

    @admin.action(description="Modérer les annonces sélectionnées")
    def moderer(self, request, queryset):
        queryset.update(statut="MODEREE")

    @admin.action(description="Activer les annonces sélectionnées")
    def activer(self, request, queryset):
        queryset.update(statut="ACTIVE")
