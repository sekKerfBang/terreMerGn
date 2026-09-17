import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Mail, MapPin, Phone, Send } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const FORMULAIRE_INITIAL = {
  nom: "",
  email: "",
  telephone: "",
  motif: "ASSISTANCE",
  message: "",
};

const messageErreur = (error) => {
  const data = error.response?.data;
  if (!data) return "Impossible d'envoyer votre message.";
  return Object.values(data).flat().filter(Boolean)[0] || "Vérifiez les informations saisies.";
};

export default function Contact() {
  const { user } = useAuth();
  const [formulaire, setFormulaire] = useState(FORMULAIRE_INITIAL);
  const [envoi, setEnvoi] = useState(false);
  const [envoye, setEnvoye] = useState(false);

  useEffect(() => {
    if (user) {
      setFormulaire((ancien) => ({
        ...ancien,
        nom: [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || "",
        email: user.email || "",
        telephone: user.telephone || "",
      }));
    }
  }, [user]);

  const modifier = (event) => {
    const { name, value } = event.target;
    setFormulaire((ancien) => ({ ...ancien, [name]: value }));
  };

  const soumettre = async (event) => {
    event.preventDefault();
    setEnvoi(true);
    try {
      await api.post("/auth/contact/", formulaire);
      setEnvoye(true);
      toast.success("Votre message a été envoyé.");
    } catch (error) {
      toast.error(messageErreur(error));
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto animate-fade-up">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] items-start">
        <section className="relative overflow-hidden rounded-3xl p-7 md:p-9 text-white shadow-lift"
          style={{ background: "linear-gradient(140deg, #063b5c 0%, #087f8c 55%, #128a66 100%)" }}>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
              <Mail size={23} />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/70">TerreMerGn</p>
            <h1 className="!text-3xl md:!text-4xl text-white mt-3">Parlons de votre demande.</h1>
            <p className="text-white/80 mt-4 leading-relaxed">
              Une question, un problème ou une idée ? Envoyez-nous les détails et notre équipe vous répondra.
            </p>
            <div className="space-y-4 mt-9 text-sm text-white/85">
              <div className="flex items-center gap-3"><Mail size={17} className="text-lagune-300" /> contact@terremergn.com</div>
              <div className="flex items-center gap-3"><Phone size={17} className="text-lagune-300" /> +224 620 00 00 00</div>
              <div className="flex items-center gap-3"><MapPin size={17} className="text-lagune-300" /> Conakry, Guinée</div>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-24 w-72 h-72 rounded-full border-[32px] border-white/10" />
        </section>

        <section className="carte p-6 md:p-8">
          {envoye ? (
            <div className="py-10 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-5">
                <CheckCircle2 className="text-emerald-600" size={30} />
              </div>
              <h2>Message envoyé</h2>
              <p className="text-slate-500 mt-3 max-w-md mx-auto">
                Merci pour votre message. Notre équipe reviendra vers vous à l'adresse indiquée.
              </p>
              <div className="flex justify-center gap-3 mt-7 flex-wrap">
                <button type="button" className="btn-secondaire" onClick={() => {
                  setFormulaire(FORMULAIRE_INITIAL);
                  setEnvoye(false);
                }}>
                  Envoyer un autre message
                </button>
                <Link to="/" className="btn-primaire">Retour à l'accueil</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={soumettre} className="space-y-5">
              <div>
                <h2 className="text-2xl">Contactez la plateforme</h2>
                <p className="text-slate-500 text-sm mt-1">Remplissez ce formulaire, nous vous répondrons rapidement.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-nom">Nom complet</label>
                  <input id="contact-nom" name="nom" value={formulaire.nom} onChange={modifier} required />
                </div>
                <div>
                  <label htmlFor="contact-email">Adresse e-mail</label>
                  <input id="contact-email" name="email" type="email" value={formulaire.email} onChange={modifier} required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-telephone">Téléphone <span className="font-normal text-slate-400">(facultatif)</span></label>
                  <input id="contact-telephone" name="telephone" type="tel" value={formulaire.telephone} onChange={modifier} placeholder="+224 ..." />
                </div>
                <div>
                  <label htmlFor="contact-motif">Motif du contact</label>
                  <select id="contact-motif" name="motif" value={formulaire.motif} onChange={modifier} required>
                    <option value="ASSISTANCE">Assistance</option>
                    <option value="SIGNALEMENT">Signaler un problème</option>
                    <option value="PARTENARIAT">Partenariat</option>
                    <option value="AUTRE">Autre demande</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="contact-message">Votre message</label>
                <textarea id="contact-message" name="message" rows="6" value={formulaire.message}
                  onChange={modifier} placeholder="Expliquez-nous votre demande..." required />
              </div>
              <button type="submit" className="btn-primaire" disabled={envoi}>
                <Send size={16} /> {envoi ? "Envoi en cours…" : "Envoyer ma demande"}
              </button>
              <Link to="/" className="btn-ghost ml-2"><ArrowLeft size={16} /> Retour</Link>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
