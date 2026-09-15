"""
Script de données de démo pour TerreMerGn.

Usage :
    python seed.py            # Crée les données (idempotent)
    python seed.py --reset    # Supprime tout puis recrée
"""

import os
import sys
import django
from datetime import timedelta
from decimal import Decimal

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth import get_user_model
from django.utils import timezone
from annonces.models import Categorie, Annonce
from messagerie.models import Message

# Import paiements (si l'app existe déjà chez toi)
try:
    from paiements.models import Transaction
    PAIEMENTS_OK = True
except Exception:
    PAIEMENTS_OK = False

U = get_user_model()

RESET = "--reset" in sys.argv


# ─────────────────────────────────────────────────────────────
#  UTILITAIRES
# ─────────────────────────────────────────────────────────────
def ligne(txt=""):
    print(f"\n{'━' * 60}\n  {txt}\n{'━' * 60}" if txt else "")


def reset_db():
    ligne("🧹 Suppression des données de démo")
    if PAIEMENTS_OK:
        Transaction.objects.all().delete()
        print("  · Transactions supprimées")
    Message.objects.all().delete()
    print("  · Messages supprimés")
    Annonce.objects.all().delete()
    print("  · Annonces supprimées")
    Categorie.objects.all().delete()
    print("  · Catégories supprimées")
    U.objects.filter(username__in=[
        "pecheur1", "pecheur2", "eleveur1", "agri1", "agri2",
        "acheteur1", "acheteur2", "admin",
    ]).delete()
    print("  · Utilisateurs de démo supprimés")


# ─────────────────────────────────────────────────────────────
#  ÉTAPE 0 — Reset optionnel
# ─────────────────────────────────────────────────────────────
if RESET:
    reset_db()


# ─────────────────────────────────────────────────────────────
#  ÉTAPE 1 — Utilisateurs
# ─────────────────────────────────────────────────────────────
ligne("👤 Création des utilisateurs")

USERS = [
    # username, role, localite, telephone, prenom, nom, email, is_staff
    ("pecheur1",  "PECHEUR",     "Conakry", "620000001", "Fatou",    "Camara",  "fatou@terremergn.gn",   False),
    ("pecheur2",  "PECHEUR",     "Boffa",   "620000011", "Sékou",    "Bangoura","sekou@terremergn.gn",   False),
    ("eleveur1",  "ELEVAGE",     "Kindia",  "620000002", "Mamadou",  "Diallo",  "mamadou@terremergn.gn", False),
    ("agri1",     "AGRICULTURE", "Kankan",  "620000003", "Aminata",  "Barry",   "aminata@terremergn.gn", False),
    ("agri2",     "AGRICULTURE", "Nzérékoré","620000022","Kadiatou", "Touré",   "kadiatou@terremergn.gn",False),
    ("acheteur1", "ACHETEUR",    "Conakry", "620000004", "Ibrahima", "Sylla",   "ibrahima@terremergn.gn",False),
    ("acheteur2", "ACHETEUR",    "Labé",    "620000044", "Aïssatou", "Bah",     "aissatou@terremergn.gn",False),
]

for username, role, loc, tel, prenom, nom, email, is_staff in USERS:
    u, created = U.objects.get_or_create(
        username=username,
        defaults=dict(
            role=role, localite=loc, telephone=tel,
            first_name=prenom, last_name=nom, email=email,
            is_staff=is_staff,
        ),
    )
    u.set_password("demo1234")
    u.save()
    print(f"  {'✨' if created else '·'} {username:<12} ({role})")

# Admin séparé
admin, created = U.objects.get_or_create(
    username="admin",
    defaults=dict(
        is_staff=True, is_superuser=True, role="ACHETEUR",
        localite="Conakry", email="admin@terremergn.gn",
        first_name="Admin", last_name="TerreMerGn",
    ),
)
admin.set_password("admin1234")
admin.save()
print(f"  {'✨' if created else '·'} admin        (SUPERUSER)")


# ─────────────────────────────────────────────────────────────
#  ÉTAPE 2 — Catégories
# ─────────────────────────────────────────────────────────────
ligne("🏷️  Création des catégories")

CATEGORIES = [
    # (nom, secteur, description)
    ("Poisson frais",             "PECHE",       "Poissons frais du jour, toutes espèces"),
    ("Poisson fumé",              "PECHE",       "Poissons fumés au feu de bois"),
    ("Crustacés & fruits de mer", "PECHE",       "Crevettes, crabes, huîtres"),
    ("Volaille",                  "ELEVAGE",     "Poulets, pintades, canards"),
    ("Bétail (bœuf, caprin)",     "ELEVAGE",     "Bovins, ovins, caprins"),
    ("Œufs",                      "ELEVAGE",     "Œufs de poule, pintade, caille"),
    ("Céréales (riz, fonio)",     "AGRICULTURE", "Riz, fonio, maïs, mil"),
    ("Légumes",                   "AGRICULTURE", "Tomates, oignons, piments"),
    ("Fruits",                    "AGRICULTURE", "Mangues, ananas, agrumes"),
    ("Maraîchage",                "AGRICULTURE", "Légumes-feuilles, salades"),
    ("Tubercules",                "AGRICULTURE", "Manioc, igname, patate douce"),
]

cats = {}
for nom, secteur, desc in CATEGORIES:
    obj, created = Categorie.objects.get_or_create(
        nom=nom, secteur=secteur,
        defaults=dict(description=desc),
    )
    cats[nom] = obj
    print(f"  {'✨' if created else '·'} {nom:<28} [{secteur}]")


# ─────────────────────────────────────────────────────────────
#  ÉTAPE 3 — Annonces
# ─────────────────────────────────────────────────────────────
ligne("📢 Création des annonces")

ANNONCES = [
    # titre, description, prix, unite, quantite, cat, localite, auteur, image_key
    (
        "Thon frais pêché ce matin",
        "Thon jaune de qualité supérieure, pêché à Boulbinet ce matin. "
        "Livraison possible dans Conakry sous 24h. Idéal restaurants et revendeurs.",
        35000, "KG", 200, "Poisson frais", "Conakry", "pecheur1",
    ),
    (
        "Carpe fumée de haute qualité",
        "Carpes fumées au feu de bois selon la méthode traditionnelle boffa. "
        "Emballées par paquet de 5 kg, prêtes pour l'export.",
        18000, "KG", 150, "Poisson fumé", "Boffa", "pecheur2",
    ),
    (
        "Crevettes géantes fraîches",
        "Crevettes géantes (taille XL) pêchées en lagune. Conservation sur glace garantie.",
        120000, "KG", 40, "Crustacés & fruits de mer", "Boffa", "pecheur2",
    ),
    (
        "Poulets de chair fermiers",
        "Poulets élevés en plein air, nourris au grain naturel. "
        "Prêts à l'abattage (2-2.5 kg en moyenne). Commandes en gros disponibles.",
        55000, "PIECE", 300, "Volaille", "Kindia", "eleveur1",
    ),
    (
        "Bœufs de race azawaké",
        "Bœufs robustes et vaccinés, race azawaké réputée pour sa viande savoureuse. "
        "Transport possible sur tout le territoire national.",
        2500000, "PIECE", 15, "Bétail (bœuf, caprin)", "Kankan", "eleveur1",
    ),
    (
        "Plateaux d'œufs frais",
        "Plateaux de 30 œufs frais, ramassés quotidiennement. "
        "Poules pondeuses en bonne santé, alimentation équilibrée.",
        45000, "PIECE", 500, "Œufs", "Kindia", "eleveur1",
    ),
    (
        "Riz de Kankan (sac 50 kg)",
        "Riz blanc parfumé de première qualité, récolte 2026. "
        "Trié et conditionné en sacs de 50 kg. Idéal pour revendeurs.",
        320000, "SAC", 400, "Céréales (riz, fonio)", "Kankan", "agri1",
    ),
    (
        "Fonio précieux de Haute-Guinée",
        "Fonio de qualité supérieure, sans cailloux, prêt à cuire. "
        "Céréale locale très prisée pour ses qualités nutritionnelles.",
        8500, "KG", 600, "Céréales (riz, fonio)", "Kankan", "agri1",
    ),
    (
        "Tomates fraîches du maraîcher",
        "Tomates cultivées sans pesticides chimiques, cueillies du jour. "
        "Vente au kilo ou en cageot pour revendeurs.",
        5000, "KG", 300, "Légumes", "Conakry", "agri1",
    ),
    (
        "Mangues juteuses de saison",
        "Mangues variété Kent, chair sucrée et peu fibreuse. "
        "Vente en gros pour exportateurs et détaillants.",
        15000, "KG", 200, "Fruits", "Kindia", "agri2",
    ),
    (
        "Ananas pain de sucre",
        "Ananas pain de sucre de Nzérékoré, réputé pour son goût sucré. "
        "Récolte fraîche, calibre moyen à gros.",
        6000, "PIECE", 500, "Fruits", "Nzérékoré", "agri2",
    ),
    (
        "Manioc doux frais",
        "Manioc doux tout juste récolté, idéal pour attiéké, placali, etc. "
        "Récolte hebdomadaire, disponibilité toute l'année.",
        3500, "KG", 800, "Tubercules", "Nzérékoré", "agri2",
    ),
]

annonces_crees = []
for titre, desc, prix, unite, qte, cat_nom, loc, auteur_username, in ANNONCES:
    auteur = U.objects.get(username=auteur_username)
    obj, created = Annonce.objects.get_or_create(
        titre=titre,
        defaults=dict(
            description=desc,
            prix=prix,
            unite=unite,
            quantite=qte,
            categorie=cats[cat_nom],
            localite=loc,
            auteur=auteur,
            statut="ACTIVE",
        ),
    )
    annonces_crees.append(obj)
    print(f"  {'✨' if created else '·'} {titre[:45]:<45} — {prix:,} GNF".replace(",", " "))


# ─────────────────────────────────────────────────────────────
#  ÉTAPE 4 — Messages de démo
# ─────────────────────────────────────────────────────────────
ligne("💬 Création des messages")

acheteur1 = U.objects.get(username="acheteur1")
acheteur2 = U.objects.get(username="acheteur2")
pecheur1  = U.objects.get(username="pecheur1")
agri1     = U.objects.get(username="agri1")

CONVERSATIONS = [
    # (expediteur, destinataire, contenu, annonce_titre)
    (acheteur1, pecheur1,
     "Bonjour Fatou, je suis intéressé par votre thon frais. "
     "Avez-vous 50 kg disponibles pour demain ?",
     "Thon frais pêché ce matin"),
    (pecheur1, acheteur1,
     "Bonjour Ibrahima ! Oui, j'ai la quantité. Livraison possible à Conakry demain matin.",
     "Thon frais pêché ce matin"),
    (acheteur1, pecheur1,
     "Parfait, je confirme. Quel est le prix pour 50 kg avec livraison ?",
     "Thon frais pêché ce matin"),
    (acheteur2, agri1,
     "Bonjour Aminata, le riz est-il parfumé ? Je cherche une qualité restaurant.",
     "Riz de Kankan (sac 50 kg)"),
    (agri1, acheteur2,
     "Bonjour Aïssatou, oui c'est du riz parfumé local, très apprécié. "
     "Combien de sacs vous faut-il ?",
     "Riz de Kankan (sac 50 kg)"),
]

for exp, dest, contenu, annonce_titre in CONVERSATIONS:
    annonce = Annonce.objects.filter(titre=annonce_titre).first()
    msg, created = Message.objects.get_or_create(
        expediteur=exp,
        destinataire=dest,
        contenu=contenu,
        defaults=dict(annonce=annonce, lu=True),
    )
    if created:
        print(f"  ✨ {exp.username} → {dest.username} : {contenu[:50]}…")


# ─────────────────────────────────────────────────────────────
#  ÉTAPE 5 — Transactions de démo (si module paiements dispo)
# ─────────────────────────────────────────────────────────────
if PAIEMENTS_OK:
    ligne("💳 Création des transactions de démo")

    TRANSACTIONS = [
        # (acheteur, annonce_titre, operateur, quantite, statut, telephone)
        (acheteur1, "Thon frais pêché ce matin",       "ORANGE_MONEY", 10, "REUSSIE",    "+224620000004"),
        (acheteur2, "Riz de Kankan (sac 50 kg)",       "MTN_MOMO",      2, "EN_ATTENTE", "+224620000044"),
        (acheteur1, "Poulets de chair fermiers",       "BANCAIRE",      5, "INITIEE",    ""),
    ]

    for acheteur, annonce_titre, operateur, qte, statut, tel in TRANSACTIONS:
        annonce = Annonce.objects.filter(titre=annonce_titre).first()
        if not annonce:
            continue
        montant = Decimal(annonce.prix) * qte
        tx, created = Transaction.objects.get_or_create(
            acheteur=acheteur,
            annonce=annonce,
            defaults=dict(
                vendeur=annonce.auteur,
                quantite=qte,
                montant=montant,
                operateur=operateur,
                telephone_client=tel,
                statut=statut,
                cree_le=timezone.now() - timedelta(days=1),
            ),
        )
        if created:
            print(f"  ✨ {tx.reference} — {acheteur.username} → {annonce.auteur.username} "
                  f"({montant:,} GNF, {operateur}, {statut})".replace(",", " "))
else:
    ligne("⚠️  Module paiements non détecté — transactions ignorées")
    print("  (Crée l'app 'paiements' pour activer les transactions de démo)")


# ─────────────────────────────────────────────────────────────
#  RÉCAPITULATIF FINAL
# ─────────────────────────────────────────────────────────────
ligne("✅ Données de démo prêtes !")

print(f"""
  📊 Récapitulatif :
     · Utilisateurs  : {U.objects.count()}
     · Catégories    : {Categorie.objects.count()}
     · Annonces      : {Annonce.objects.count()}
     · Messages      : {Message.objects.count()}
""")

if PAIEMENTS_OK:
    print(f"     · Transactions  : {Transaction.objects.count()}")
    print()

print("""
  🔑 Comptes de connexion :
  ┌────────────────────────────────────────────────────┐
  │  Rôle         │  Identifiant   │  Mot de passe      │
  ├────────────────────────────────────────────────────┤
  │  🐟 Pêcheur    │  pecheur1      │  demo1234          │
  │  🐟 Pêcheur    │  pecheur2      │  demo1234          │
  │  🐄 Éleveur    │  eleveur1      │  demo1234          │
  │  🌾 Agri       │  agri1 / agri2 │  demo1234          │
  │  🛒 Acheteur   │  acheteur1/2   │  demo1234          │
  │  🛡️  Admin      │  admin         │  admin1234         │
  └────────────────────────────────────────────────────┘

  🌐 URL admin : http://127.0.0.1:8000/admin/
""")

if not PAIEMENTS_OK:
    print("""
  ⚠️  Prochaine étape : créer l'app paiements
  
      python manage.py startapp paiements
      # puis ajouter 'paiements' dans INSTALLED_APPS
      # et relancer ce script
""")