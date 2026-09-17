import { useState } from "react";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";

export default function MotDePasseOublie() {
  const [email, setEmail] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [termine, setTermine] = useState(false);

  const soumettre = async (event) => {
    event.preventDefault();
    setEnvoi(true);
    try {
      await api.post("/auth/password-reset/", { email });
      setTermine(true);
    } catch {
      toast.error("Impossible d'envoyer le lien pour le moment.");
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="form-box animate-fade-up">
      <div className="text-center mb-7">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-ocean-100 flex items-center justify-center mb-4">
          <Mail className="text-ocean-700" size={24} />
        </div>
        <h2>Mot de passe oublié ?</h2>
        <p className="text-slate-500 text-sm mt-2">
          Saisissez votre adresse e-mail pour recevoir un lien de réinitialisation.
        </p>
      </div>

      {termine ? (
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 text-sm leading-relaxed">
          Si cette adresse existe, un lien vient d'être envoyé. Consultez votre boîte de réception.
        </div>
      ) : (
        <form onSubmit={soumettre} className="space-y-4">
          <div>
            <label htmlFor="reset-email">Adresse e-mail</label>
            <div className="relative">
              <Mail size={16} className="input-icone" />
              <input id="reset-email" className="!pl-10" type="email" value={email}
                onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
            </div>
          </div>
          <button type="submit" className="btn-primaire w-full" disabled={envoi}>
            <Send size={16} /> {envoi ? "Envoi…" : "Recevoir le lien"}
          </button>
        </form>
      )}

      <Link to="/login" className="btn-ghost mx-auto mt-6">
        <ArrowLeft size={16} /> Retour à la connexion
      </Link>
    </div>
  );
}
