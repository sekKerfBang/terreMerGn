from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ["reference", "annonce", "acheteur", "vendeur", "montant",
                    "operateur", "statut", "cree_le"]
    list_filter = ["operateur", "statut", "cree_le"]
    search_fields = ["reference", "acheteur__username", "annonce__titre"]
    readonly_fields = ["reference", "reponse_gateway", "cree_le", "maj_le"]