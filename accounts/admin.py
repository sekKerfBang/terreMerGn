from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Utilisateur


@admin.register(Utilisateur)
class UtilisateurAdmin(UserAdmin):
    list_display = ["username", "email", "role", "localite", "telephone", "is_staff"]
    list_filter = ["role", "localite", "is_staff"]
    fieldsets = UserAdmin.fieldsets + (
        ("Profil TerreMerGn", {"fields": ("telephone", "localite", "role", "bio")}),
    )
