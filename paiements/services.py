"""Passerelle unifiée — LigdiCash (Orange Guinée + MTN Guinée)."""
import os
import requests


class PasserellePaiement:
    BASE_URL = os.environ.get("PAYMENT_GATEWAY_URL", "https://app.ligdicash.com")
    API_KEY = os.environ.get("PAYMENT_API_KEY", "")
    API_TOKEN = os.environ.get("PAYMENT_API_TOKEN", "")
    CALLBACK_URL = os.environ.get(
        "PAYMENT_CALLBACK_URL",
        "https://terremergn-api.onrender.com/api/paiements/callback/",
    )
    SITE_URL = os.environ.get("SITE_URL", "https://terremergn.onrender.com")

    OPERATEURS = {
        "ORANGE_MONEY": {"operator_id": 33, "name": "ORANGE GUINEE"},
        "MTN_MOMO":     {"operator_id": 51, "name": "MTN GUINEE"},
    }

    @classmethod
    def initier(cls, transaction, return_url=""):
        if transaction.operateur in cls.OPERATEURS:
            return cls._mobile_money(transaction, return_url)
        if transaction.operateur == "BANCAIRE":
            return cls._bancaire(transaction, return_url)
        raise ValueError(f"Opérateur inconnu : {transaction.operateur}")

    @classmethod
    def _mobile_money(cls, transaction, return_url):
        op = cls.OPERATEURS[transaction.operateur]
        tel = transaction.telephone_client.replace("+224", "").replace(" ", "")
        payload = {
            "commande": {
                "invoice": {
                    "items": [],
                    "total_amount": int(transaction.montant),
                    "devise": "GNF",
                    "description": f"Annonce {transaction.annonce.titre[:80]}",
                    "customer": f"224{tel}",
                    "customer_firstname": transaction.acheteur.first_name or "Client",
                    "customer_lastname": transaction.acheteur.last_name or "TerreMerGn",
                    "customer_email": transaction.acheteur.email or "",
                    "otp": "",
                },
                "store": {"name": "TerreMerGn", "website_url": cls.SITE_URL},
                "actions": {
                    "cancel_url": return_url or cls.SITE_URL,
                    "return_url": return_url or cls.SITE_URL,
                    "callback_url": cls.CALLBACK_URL,
                },
                "custom_data": {"reference": transaction.reference},
            }
        }
        headers = {
            "Apikey": cls.API_KEY,
            "Authorization": f"Bearer {cls.API_TOKEN}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        r = requests.post(
            f"{cls.BASE_URL}/pay/v01/straight/checkout-invoice/create",
            json=payload, headers=headers, timeout=30,
        )
        r.raise_for_status()
        data = r.json()
        transaction.token_gateway = data.get("token", "")
        transaction.url_paiement = data.get("response_text", "")
        transaction.reponse_gateway = data
        transaction.statut = "EN_ATTENTE"
        transaction.save()
        return {"url_paiement": transaction.url_paiement, "token": transaction.token_gateway}

    @classmethod
    def _bancaire(cls, transaction, return_url):
        # Adapter à ton partenaire (Djomy / Kalinko) — payload exemple
        payload = {
            "amount": int(transaction.montant),
            "currency": "GNF",
            "method": "BANK_TRANSFER",
            "reference": transaction.reference,
            "customer": {
                "name": f"{transaction.acheteur.first_name} {transaction.acheteur.last_name}".strip(),
                "email": transaction.acheteur.email or "",
                "phone": transaction.telephone_client,
            },
            "callback_url": cls.CALLBACK_URL,
            "return_url": return_url or cls.SITE_URL,
        }
        headers = {"Authorization": f"Bearer {cls.API_TOKEN}", "Content-Type": "application/json"}
        r = requests.post(f"{cls.BASE_URL}/api/v1/payments/bank",
                          json=payload, headers=headers, timeout=30)
        r.raise_for_status()
        data = r.json()
        transaction.url_paiement = data.get("payment_url", "")
        transaction.reponse_gateway = data
        transaction.statut = "EN_ATTENTE"
        transaction.save()
        return {"url_paiement": transaction.url_paiement, "instructions": data.get("instructions", "")}