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
        fields = ["id", "username", "first_name", "last_name", "email", "avatar",
                  "telephone", "localite", "role", "role_display", "bio", "is_staff"]
        read_only_fields = ["is_staff"]


class PasswordChangeSerializer(serializers.Serializer):
    ancien_mot_de_passe = serializers.CharField(write_only=True)
    nouveau_mot_de_passe = serializers.CharField(write_only=True, min_length=6)
    confirmation_mot_de_passe = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = self.context["request"].user
        if not user.check_password(attrs["ancien_mot_de_passe"]):
            raise serializers.ValidationError({"ancien_mot_de_passe": "Mot de passe actuel incorrect."})
        if attrs["nouveau_mot_de_passe"] != attrs["confirmation_mot_de_passe"]:
            raise serializers.ValidationError({"confirmation_mot_de_passe": "Les mots de passe ne correspondent pas."})
        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["nouveau_mot_de_passe"])
        user.save(update_fields=["password"])
        return user


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    nouveau_mot_de_passe = serializers.CharField(write_only=True, min_length=6)
    confirmation_mot_de_passe = serializers.CharField(write_only=True)

    def validate(self, attrs):
        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_decode

        try:
            user_id = urlsafe_base64_decode(attrs["uid"]).decode()
            user = Utilisateur.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, Utilisateur.DoesNotExist):
            raise serializers.ValidationError({"token": "Lien de réinitialisation invalide."})

        if not default_token_generator.check_token(user, attrs["token"]):
            raise serializers.ValidationError({"token": "Lien de réinitialisation expiré ou invalide."})
        if attrs["nouveau_mot_de_passe"] != attrs["confirmation_mot_de_passe"]:
            raise serializers.ValidationError({"confirmation_mot_de_passe": "Les mots de passe ne correspondent pas."})

        attrs["user"] = user
        return attrs

    def save(self, **kwargs):
        user = self.validated_data["user"]
        user.set_password(self.validated_data["nouveau_mot_de_passe"])
        user.save(update_fields=["password"])
        return user


class ContactSerializer(serializers.Serializer):
    nom = serializers.CharField(max_length=120)
    email = serializers.EmailField()
    telephone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    motif = serializers.ChoiceField(choices=[
        ("ASSISTANCE", "Assistance"),
        ("SIGNALEMENT", "Signaler un problème"),
        ("PARTENARIAT", "Partenariat"),
        ("AUTRE", "Autre demande"),
    ])
    message = serializers.CharField(max_length=5000)
