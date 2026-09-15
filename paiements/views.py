from decimal import Decimal
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

from annonces.models import Annonce
from .models import Transaction
from .serializers import TransactionSerializer
from .services import PasserellePaiement


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def initier(request, annonce_id):
    """Body: { operateur: 'ORANGE_MONEY'|'MTN_MOMO'|'BANCAIRE', telephone_client, quantite, return_url }"""
    annonce = get_object_or_404(Annonce, pk=annonce_id)
    if annonce.auteur == request.user:
        return Response({"detail": "Vous ne pouvez pas acheter votre propre annonce."},
                        status=status.HTTP_400_BAD_REQUEST)

    operateur = request.data.get("operateur")
    if operateur not in dict(Transaction.Operateur.choices):
        return Response({"detail": "Opérateur invalide."}, status=400)

    quantite = int(request.data.get("quantite", 1))
    if quantite < 1 or quantite > annonce.quantite:
        return Response({"detail": f"Quantité invalide (1 à {annonce.quantite})."}, status=400)

    tel = request.data.get("telephone_client", "")
    if operateur in ["ORANGE_MONEY", "MTN_MOMO"] and not tel:
        return Response({"detail": "Numéro de téléphone requis."}, status=400)

    montant = Decimal(annonce.prix) * quantite

    tx = Transaction.objects.create(
        annonce=annonce,
        acheteur=request.user,
        vendeur=annonce.auteur,
        quantite=quantite,
        montant=montant,
        operateur=operateur,
        telephone_client=tel,
    )

    try:
        result = PasserellePaiement.initier(tx, return_url=request.data.get("return_url", ""))
    except Exception as e:
        tx.statut = "ECHOUEE"
        tx.reponse_gateway = {"error": str(e)}
        tx.save()
        return Response({"detail": f"Erreur passerelle : {e}"}, status=502)

    return Response({
        "transaction": TransactionSerializer(tx).data,
        "url_paiement": result.get("url_paiement"),
        "instructions": result.get("instructions", ""),
    }, status=201)


@api_view(["POST"])
@permission_classes([AllowAny])
def callback(request):
    """Appelé par la passerelle après paiement."""
    data = request.data
    token = data.get("token") or data.get("reference")
    statut_gw = (data.get("status") or "").lower()

    tx = Transaction.objects.filter(token_gateway=token).first() \
         or Transaction.objects.filter(reference=token).first()
    if not tx:
        return Response({"detail": "Transaction introuvable"}, status=404)

    if statut_gw in ["success", "completed", "paid"]:
        tx.statut = "REUSSIE"
        # Décrémenter le stock
        a = tx.annonce
        a.quantite = max(0, a.quantite - tx.quantite)
        if a.quantite == 0:
            a.statut = "VENDU"
        a.save()
    elif statut_gw in ["failed", "error"]:
        tx.statut = "ECHOUEE"
    elif statut_gw in ["cancelled", "cancel"]:
        tx.statut = "ANNULEE"

    tx.reponse_gateway = data
    tx.save()
    return Response({"detail": "ok"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def statut(request, reference):
    tx = get_object_or_404(Transaction, reference=reference, acheteur=request.user)
    return Response(TransactionSerializer(tx).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mes_achats(request):
    qs = Transaction.objects.filter(acheteur=request.user)
    return Response(TransactionSerializer(qs, many=True).data)