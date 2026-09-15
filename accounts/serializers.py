from rest_framework import serializers
from django.contrib.auth import get_user_model

Utilisateur = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = Utilisateur
        fields = ["id", "username", "email", "password", "first_name", "last_name",
                  "telephone", "localite", "role"]

    def create(self, validated_data):
        return Utilisateur.objects.create_user(**validated_data)


class UtilisateurSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source="get_role_display", read_only=True)

    class Meta:
        model = Utilisateur
        fields = ["id", "username", "first_name", "last_name", "email",
                  "telephone", "localite", "role", "role_display", "bio", "is_staff"]
        read_only_fields = ["is_staff"]
