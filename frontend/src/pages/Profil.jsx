import { useEffect, useState } from "react";
import { Camera, LockKeyhole, Save, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const messageErreur = (error, fallback) => {
  const data = error.response?.data;
  if (!data) return fallback;
  const messages = Object.values(data).flat().filter(Boolean);
  return messages[0] || fallback;
};

const THEMES_ROLE = {
  PECHEUR: {
    emoji: "🐟",
    titre: "Profil pêcheur",
    sousTitre: "Entre mer, savoir-faire et produits frais.",
    fond: "linear-gradient(120deg, #063b5c 0%, #087f8c 52%, #37b6ad 100%)",
    halo: "rgba(148, 233, 226, 0.28)",
  },
  ELEVAGE: {
    emoji: "🐄",
    titre: "Profil éleveur",
    sousTitre: "Un quotidien au rythme du vivant et des pâturages.",
    fond: "linear-gradient(120deg, #4b2f1f 0%, #8a5a32 52%, #c59658 100%)",
    halo: "rgba(255, 224, 166, 0.28)",
  },
  AGRICULTURE: {
    emoji: "🌾",
    titre: "Profil agriculteur",
    sousTitre: "La terre, les récoltes et votre savoir-faire au centre.",
    fond: "linear-gradient(120deg, #315b26 0%, #6c8d32 52%, #b2b94d 100%)",
    halo: "rgba(240, 238, 135, 0.3)",
  },
  ACHETEUR: {
    emoji: "🛒",
    titre: "Profil acheteur",
    sousTitre: "Trouvez les bons produits, directement auprès des producteurs.",
    fond: "linear-gradient(120deg, #5b2738 0%, #9b4d4e 52%, #d18a5b 100%)",
    halo: "rgba(255, 220, 175, 0.28)",
  },
};

export default function Profil() {
  const { user, mettreAJourUtilisateur } = useAuth();
  const themeRole = THEMES_ROLE[user?.role] || THEMES_ROLE.ACHETEUR;
  const [profil, setProfil] = useState({ first_name: "", last_name: "", email: "" });
  const [avatar, setAvatar] = useState(null);
  const [apercu, setApercu] = useState("");
  const [motDePasse, setMotDePasse] = useState({
    ancien_mot_de_passe: "",
    nouveau_mot_de_passe: "",
    confirmation_mot_de_passe: "",
  });
  const [enregistrement, setEnregistrement] = useState(false);
  const [changementMotDePasse, setChangementMotDePasse] = useState(false);

  useEffect(() => {
    setProfil({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
    });
    setApercu(user?.avatar || "");
  }, [user]);

  const choisirAvatar = (event) => {
    const fichier = event.target.files?.[0];
    if (!fichier) return;
    setAvatar(fichier);
    setApercu(URL.createObjectURL(fichier));
  };

  const enregistrerProfil = async (event) => {
    event.preventDefault();
    setEnregistrement(true);
    try {
      const donnees = new FormData();
      donnees.append("first_name", profil.first_name);
      donnees.append("last_name", profil.last_name);
      donnees.append("email", profil.email);
      if (avatar) donnees.append("avatar", avatar);
      const { data } = await api.patch("/auth/me/", donnees);
      mettreAJourUtilisateur(data);
      setAvatar(null);
      toast.success("Profil mis à jour.");
    } catch (error) {
      toast.error(messageErreur(error, "Impossible de mettre à jour le profil."));
    } finally {
      setEnregistrement(false);
    }
  };

  const changerMotDePasse = async (event) => {
    event.preventDefault();
    setChangementMotDePasse(true);
    try {
      await api.post("/auth/password/", motDePasse);
      setMotDePasse({ ancien_mot_de_passe: "", nouveau_mot_de_passe: "", confirmation_mot_de_passe: "" });
      toast.success("Mot de passe modifié.");
    } catch (error) {
      toast.error(messageErreur(error, "Impossible de modifier le mot de passe."));
    } finally {
      setChangementMotDePasse(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
      <div className="relative overflow-hidden rounded-3xl px-6 py-8 md:px-10 md:py-10 text-white shadow-lift" style={{ background: themeRole.fond }}>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-white/75">
            <span>{themeRole.emoji}</span> {themeRole.titre}
          </div>
          <h1 className="!text-3xl md:!text-4xl mt-3 text-white">Mon espace personnel</h1>
          <p className="text-white/85 mt-2">{themeRole.sousTitre}</p>
          <div className="inline-flex items-center gap-2 mt-6 rounded-full bg-white/15 border border-white/25 px-4 py-2 text-sm font-bold backdrop-blur-sm">
            <span className="text-lg">{themeRole.emoji}</span>
            <span>{user?.role_display || "Acheteur"}</span>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-24 w-72 h-72 rounded-full border-[32px] border-white/10" />
        <div className="absolute right-16 -top-20 w-52 h-52 rounded-full" style={{ background: themeRole.halo }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={enregistrerProfil} className="carte p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="w-10 h-10 rounded-xl bg-ocean-50 flex items-center justify-center">
              <UserRound className="text-ocean-700" size={20} />
            </div>
            <div>
              <h2 className="text-xl">Informations personnelles</h2>
              <p className="text-sm text-slate-500">Votre nom visible par les autres utilisateurs.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-ocean-700 text-white flex items-center justify-center text-3xl font-bold shrink-0">
              {apercu ? <img src={apercu} alt="Photo de profil" className="w-full h-full object-cover" /> : (user?.first_name?.[0] || user?.username?.[0] || "?").toUpperCase()}
            </div>
            <label className="btn-secondaire cursor-pointer !py-2.5">
              <Camera size={16} /> Changer la photo
              <input type="file" accept="image/*" onChange={choisirAvatar} className="hidden" />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="first_name">Prénom</label>
              <input id="first_name" value={profil.first_name} onChange={(e) => setProfil({ ...profil, first_name: e.target.value })} />
            </div>
            <div>
              <label htmlFor="last_name">Nom</label>
              <input id="last_name" value={profil.last_name} onChange={(e) => setProfil({ ...profil, last_name: e.target.value })} />
            </div>
          </div>
          <div>
            <label htmlFor="email">Adresse e-mail</label>
            <input id="email" type="email" value={profil.email} onChange={(e) => setProfil({ ...profil, email: e.target.value })} />
          </div>
          <div>
            <label>Nom d'utilisateur</label>
            <input value={user?.username || ""} disabled className="!bg-slate-50 !text-slate-400" />
          </div>
          <div>
            <label>Votre rôle</label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-600">
              <span className="text-xl">{themeRole.emoji}</span>
              <span>{user?.role_display || "Acheteur"}</span>
              <span className="ml-auto text-xs font-medium text-slate-400">Défini à l’inscription</span>
            </div>
          </div>
          <button type="submit" className="btn-primaire" disabled={enregistrement}>
            <Save size={16} /> {enregistrement ? "Enregistrement…" : "Enregistrer les changements"}
          </button>
        </form>

        <form onSubmit={changerMotDePasse} className="carte p-6 md:p-8 space-y-5 h-fit">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <LockKeyhole className="text-amber-700" size={20} />
            </div>
            <div>
              <h2 className="text-xl">Mot de passe</h2>
              <p className="text-sm text-slate-500">Utilisez un mot de passe d’au moins 6 caractères.</p>
            </div>
          </div>
          <div>
            <label htmlFor="ancien_mot_de_passe">Mot de passe actuel</label>
            <input id="ancien_mot_de_passe" type="password" value={motDePasse.ancien_mot_de_passe} onChange={(e) => setMotDePasse({ ...motDePasse, ancien_mot_de_passe: e.target.value })} required />
          </div>
          <div>
            <label htmlFor="nouveau_mot_de_passe">Nouveau mot de passe</label>
            <input id="nouveau_mot_de_passe" type="password" value={motDePasse.nouveau_mot_de_passe} onChange={(e) => setMotDePasse({ ...motDePasse, nouveau_mot_de_passe: e.target.value })} required minLength={6} />
          </div>
          <div>
            <label htmlFor="confirmation_mot_de_passe">Confirmer le nouveau mot de passe</label>
            <input id="confirmation_mot_de_passe" type="password" value={motDePasse.confirmation_mot_de_passe} onChange={(e) => setMotDePasse({ ...motDePasse, confirmation_mot_de_passe: e.target.value })} required minLength={6} />
          </div>
          <button type="submit" className="btn-secondaire" disabled={changementMotDePasse}>
            <LockKeyhole size={16} /> {changementMotDePasse ? "Modification…" : "Modifier le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}
