# 🌍 TerreMerGn

Plateforme guinéenne connectant **pêcheurs**, **éleveurs** et **agriculteurs** aux acheteurs.
React (frontend) + Django REST (backend), déployable gratuitement sur Render.

## 🗂️ Structure

| Dossier | Rôle |
|---|---|
| `backend/` | Configuration Django (settings, urls, JWT) |
| `accounts/` | Modèle `Utilisateur` (rôle, localité, téléphone) + auth JWT |
| `annonces/` | Catégories, annonces, filtres, stats admin |
| `messagerie/` | Conversations + messages entre acteurs |
| `frontend/` | Application React (Vite) |
| `seed.py` | Données de démonstration |

## 🚀 Lancer en local

### 1. Backend (port 8000)

```bash
python -m venv venv
source venv/bin/activate        # Windows : venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python seed.py                  # données de démo
python manage.py runserver
```

### 2. Frontend (port 3000)

```bash
cd frontend
npm install
npm run dev
```

Le proxy Vite redirige `/api` vers Django : aucune config supplémentaire.

### 🔑 Comptes de démo

| Rôle | Identifiant | Mot de passe |
|---|---|---|
| Pêcheur | `pecheur1` | `demo1234` |
| Éleveur | `eleveur1` | `demo1234` |
| Agriculteur | `agri1` | `demo1234` |
| Acheteur | `acheteur1` | `demo1234` |
| Admin | `admin` | `admin1234` |

## ☁️ Déploiement Render (forfait gratuit)

Le fichier `render.yaml` décrit les deux services gratuits. Pour les créer :

1. Poussez le dépôt sur GitHub et ouvrez Render.
2. Sélectionnez **New → Blueprint** puis le dépôt et la branche `pre-prod`.
3. Render détecte `render.yaml` et crée `terremergn-api` et `terremergn-frontend`.
4. Renseignez les variables marquées `sync: false` dans le formulaire Render.

Variables obligatoires pour le backend :

- `DATABASE_URL` : PostgreSQL externe, par exemple Neon ou Supabase.
- `EMAIL_HOST`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD` et `DEFAULT_FROM_EMAIL` pour le reset de mot de passe.

L'URL API frontend est configurée automatiquement vers `terremergn-api.onrender.com`.
Les migrations et `collectstatic` sont exécutés au démarrage de l'image backend.

### Limites du forfait gratuit à connaître

- **Cold start** : l'API s'endort après 15 min d'inactivité → le premier appel prend ~30 s.
  Dites-le aux testeurs, ou gardez l'app active avec un ping (UptimeRobot gratuit).
- **Pas de stockage de fichiers persistant** : les images d'annonces et de profils seront perdues
  à chaque redéploiement. Utilisez Cloudinary ou un stockage objet dès que possible.

## 🔑 Mot de passe oublié

Depuis la page de connexion, l'utilisateur peut demander un lien avec son adresse e-mail.
En développement, le lien est affiché dans la console Django. En production, configurez
`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `EMAIL_USE_TLS`,
`DEFAULT_FROM_EMAIL` et `FRONTEND_URL`.

## 🐳 Conteneurs Docker

Les deux services peuvent être lancés avec Docker Compose :

```bash
cp .env.example .env
docker compose up --build
```

Le frontend est disponible sur `http://localhost:3000`, Mailpit sur `http://localhost:8025`
et le backend sur `http://localhost:8000`. Les e-mails de récupération de mot de passe
apparaissent dans Mailpit et ne sont pas envoyés vers une vraie boîte.

En lançant Django directement avec `python manage.py runserver`, Mailpit doit être démarré
sur `localhost:1025`. `DATABASE_URL` doit pointer vers une base PostgreSQL accessible depuis
le backend.

## 🔁 CI/CD et pre-prod

La branche `pre-prod` déclenche `.github/workflows/ci-cd.yml`. La pipeline vérifie Django,
les migrations, le build React et construit les deux images Docker. Pour déclencher un
déploiement Render, ajoutez le secret GitHub `RENDER_PREPROD_DEPLOY_HOOK` dans l'environnement
`pre-prod`.

## 🗺️ Prochaines étapes

1. Notifications SMS (Twilio) pour les nouvelles annonces/messages
2. Upload d'images vers Cloudinary
3. Notation des vendeurs
4. App mobile (React Native) — réutilise la même API




# 🌍 TerreMerGn

Plateforme guinéenne connectant **pêcheurs**, **éleveurs** et **agriculteurs** aux acheteurs.
React (frontend) + Django REST (backend), déployable gratuitement sur Render.

![Statut](https://img.shields.io/badge/status-en%20développement-yellow)
![Django](https://img.shields.io/badge/Django-5.1-092E20?logo=django)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Fonctionnalités

- 🔐 **Authentification JWT** (inscription, connexion, rôles : pêcheur, éleveur, agriculteur, acheteur)
- 📢 **Annonces** avec catégories par secteur, filtres, recherche, pagination
- 🖼️ **Upload d'images** sur les annonces
- 💬 **Messagerie** entre acheteurs et vendeurs (conversations + fil)
- 💳 **Paiements Guinée** : Orange Money, MTN Mobile Money, virement bancaire (via LigdiCash)
- 🛡️ **Modération admin** (dashboard stats + actions de modération)
- 🎨 **Design moderne** avec Tailwind CSS (responsive, animations)

---

## 🗂️ Structure

| Dossier | Rôle |
|---|---|
| `backend/` | Configuration Django (settings, urls, JWT) |
| `accounts/` | Modèle `Utilisateur` (rôle, localité, téléphone) + auth JWT |
| `annonces/` | Catégories, annonces, filtres, stats admin |
| `messagerie/` | Conversations + messages entre acteurs |
| `paiements/` | Transactions Orange Money, MTN MoMo, Banque |
| `frontend/` | Application React (Vite + Tailwind + React Router) |
| `seed.py` | Données de démonstration |

---

## 🚀 Lancer en local

### Prérequis

- **Python 3.12** (obligatoire — Django 5.1 ne supporte pas 3.13+)
- **Node.js 18+**
- **PostgreSQL 14+** (ou SQLite pour un démarrage rapide)

### 1. Backend (port 8000)

```bash
# Cloner le dépôt
git clone https://github.com/<ton-user>/terremergn.git
cd terremergn

# Créer l'environnement virtuel
python3.12 -m venv venv
source venv/bin/activate        # Windows : venv\Scripts\activate

# Installer les dépendances
pip install --upgrade pip
pip install -r requirements.txt

# Configurer la base de données PostgreSQL
sudo -u postgres psql <<EOF
CREATE USER terremergn WITH PASSWORD 'terremergn' CREATEDB;
CREATE DATABASE terremergn OWNER terremergn;
GRANT ALL PRIVILEGES ON DATABASE terremergn TO terremergn;
EOF

# Migrations + données de démo
python manage.py migrate
python seed.py              # ou : python seed.py --reset (efface tout et recrée)
python manage.py createsuperuser   # optionnel

# Lancer le serveur
python manage.py runserver