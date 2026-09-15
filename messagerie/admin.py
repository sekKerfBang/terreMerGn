from django.contrib import admin
from .models import Message


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ["expediteur", "destinataire", "contenu", "lu", "envoye_le"]
    list_filter = ["lu", "envoye_le"]
    search_fields = ["contenu", "expediteur__username", "destinataire__username"]
