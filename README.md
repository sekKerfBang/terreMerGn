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
source venv/bin/activate        # Windows : venv\Scriptsctivate
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

### Backend (Web Service)

1. Poussez le dépôt sur GitHub.
2. Render → **New → Web Service** → sélectionnez le dépôt.
3. Build Command : `./build.sh`
4. Start Command : `gunicorn backend.wsgi:application`
5. Variables d'environnement :
   - `DEBUG=False`
   - `SECRET_KEY` = générez-en une (`python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
   - `ALLOWED_HOSTS` = `votre-app.onrender.com`
6. ⚠️ **Base de données** : le forfait gratuit de Render ne propose pas de PostgreSQL
   persistant. Pour démarrer, SQLite fonctionne (le fichier `db.sqlite3` est recréé
   à chaque déploiement — les données de démo sont perdues). Pour la suite, ajoutez
   `DATABASE_URL` depuis un hébergeur PostgreSQL gratuit (Neon, Supabase).

### Frontend (Static Site)

1. Render → **New → Static Site** → dossier racine : `frontend`.
2. Build Command : `npm install && npm run build`
3. Publish Directory : `frontend/dist`
4. Variable : `VITE_API_URL=https://votre-app.onrender.com/api`

### Limites du forfait gratuit à connaître

- **Cold start** : l'API s'endort après 15 min d'inactivité → le premier appel prend ~30 s.
  Dites-le aux testeurs, ou gardez l'app active avec un ping (UptimeRobot gratuit).
- **Pas de stockage de fichiers persistant** : les images d'annonces seront perdues
  à chaque redéploiement. Prévoyez Cloudinary (gratuit) dès que possible.

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