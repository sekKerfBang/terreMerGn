import { useState } from "react";
import { ArrowLeft, CheckCircle2, LockKeyhole } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";

const messageErreur = (error) => {
  const data = error.response?.data;
  if (!data) return "Le lien est invalide ou expiré.";
  return Object.values(data).flat().filter(Boolean)[0] || "Le lien est invalide ou expiré.";
};

export default function ReinitialiserMotDePasse() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nouveau_mot_de_passe: "", confirmation_mot_de_passe: "" });
  const [envoi, setEnvoi] = useState(false);
  const [termine, setTermine] = useState(false);

  const soumettre = async (event) => {
    event.preventDefault();
    setEnvoi(true);
    try {
      await api.post("/auth/password-reset/confirm/", { uid, token, ...form });
      setTermine(true);
      toast.success("Mot de passe réinitialisé.");
    } catch (error) {
      toast.error(messageErreur(error));
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="form-box animate-fade-up">
      <div className="text-center mb-7">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-ocean-100 flex items-center justify-center mb-4">
          {termine ? <CheckCircle2 className="text-emerald-600" size={24} /> : <LockKeyhole className="text-ocean-700" size={24} />}
        </div>
        <h2>Nouveau mot de passe</h2>
        <p className="text-slate-500 text-sm mt-2">Choisissez un nouveau mot de passe sécurisé.</p>
      </div>

      {termine ? (
        <div className="space-y-4">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 text-sm">
            Votre mot de passe a été réinitialisé avec succès.
          </div>
          <button type="button" className="btn-primaire w-full" onClick={() => navigate("/login")}>
            Se connecter
          </button>
        </div>
      ) : (
        <form onSubmit={soumettre} className="space-y-4">
          <div>
            <label htmlFor="nouveau-mot-de-passe">Nouveau mot de passe</label>
            <input id="nouveau-mot-de-passe" type="password" minLength={6} required
              value={form.nouveau_mot_de_passe}
              onChange={(event) => setForm({ ...form, nouveau_mot_de_passe: event.target.value })} />
          </div>
          <div>
            <label htmlFor="confirmation-mot-de-passe">Confirmer le mot de passe</label>
            <input id="confirmation-mot-de-passe" type="password" minLength={6} required
              value={form.confirmation_mot_de_passe}
              onChange={(event) => setForm({ ...form, confirmation_mot_de_passe: event.target.value })} />
          </div>
          <button type="submit" className="btn-primaire w-full" disabled={envoi}>
            <LockKeyhole size={16} /> {envoi ? "Réinitialisation…" : "Enregistrer le mot de passe"}
          </button>
        </form>
      )}

      <Link to="/login" className="btn-ghost mx-auto mt-6">
        <ArrowLeft size={16} /> Retour à la connexion
      </Link>
    </div>
  );
}
