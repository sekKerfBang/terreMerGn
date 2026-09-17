import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, User, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";


const COMPTES_DEMO = [
  { u: "pecheur1", label: "🐟 Pêcheur" },
  { u: "eleveur1", label: "🐄 Éleveur" },
  { u: "agri1", label: "🌾 Agriculteur" },
  { u: "acheteur1", label: "🛒 Acheteur" },
];

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [voirMdp, setVoirMdp] = useState(false);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const soumettre = async (e) => {
    e.preventDefault();
    setChargement(true);
    setErreur("");
    try {
      await login(form.username, form.password);
      toast.success(`Bienvenue, ${form.username} ! 👋`);
      navigate("/");
    } catch {
      setErreur("Identifiants incorrects. Vérifiez votre nom d'utilisateur et mot de passe.");
    } finally {
      setChargement(false);
    }
  };

  const remplirDemo = (u) => setForm({ username: u, password: "demo1234" });

  return (
    <div className="grid lg:grid-cols-2 min-h-[calc(100vh-130px)] -mx-4">
      {/* Panneau gauche : visuel de marque */}
      <div className="hidden lg:flex flex-col justify-between p-12 text-white relative overflow-hidden"
           style={{ background: "linear-gradient(150deg, #052e23 0%, #0a513c 60%, #0d6b4f 100%)" }}>
        <div className="relative z-10">
          <div className="flex items-center gap-2 font-display font-extrabold text-2xl">
            <span className="text-3xl">🌍</span> Terre<span className="text-lagune-400">Mer</span>Gn
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="!text-4xl leading-tight">
            Le marché de la terre et de la mer,<br />directement sur votre téléphone.
          </h1>
          <ul className="mt-8 space-y-4">
            {[
              "Vendez poissons, volailles et récoltes partout en Guinée",
              "Discutez directement avec acheteurs et fournisseurs",
              "Paiement Mobile Money sécurisé",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-white/85">
                <span className="w-6 h-6 rounded-full bg-lagune-400/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={13} className="text-lagune-300" />
                </span>
                <span className="text-sm">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative z-10 text-white/40 text-xs">
          © {new Date().getFullYear()} TerreMerGn — Conakry, Guinée
        </p>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-lagune-500/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-56 h-56 bg-terre-500/20 rounded-full blur-3xl" />
      </div>

      {/* Panneau droit : formulaire */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-up">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-ocean-100 flex items-center justify-center mb-4">
              <LogIn className="text-ocean-700" size={24} />
            </div>
            <h2>Bon retour 👋</h2>
            <p className="text-slate-500 text-sm mt-1">Connectez-vous à votre compte TerreMerGn</p>
          </div>

          {erreur && <p className="erreur mb-4">{erreur}</p>}

          <form onSubmit={soumettre} className="space-y-4">
            <div>
              <label htmlFor="username">Nom d'utilisateur</label>
              <div className="relative">
                <User size={16} className="input-icone" />
                <input id="username" className="!pl-10" type="text" autoComplete="username"
                  placeholder="ex: fatou2026" value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })} required />
              </div>
            </div>
            <div>
              <label htmlFor="password">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="input-icone" />
                <input id="password" type={voirMdp ? "text" : "password"} autoComplete="current-password"
                  className="!pl-10 !pr-11" placeholder="Votre mot de passe"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setVoirMdp(!voirMdp)} aria-label="Voir le mot de passe"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ocean-700 transition-colors">
                  {voirMdp ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <button className="btn-primaire w-full !py-3" type="submit" disabled={chargement}>
              {chargement ? (
                <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <>Se connecter <ArrowRight size={17} /></>
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/mot-de-passe-oublie" className="text-sm text-ocean-700 font-semibold hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Pas de compte ?{" "}
            <Link to="/register" className="text-ocean-700 font-bold hover:underline">
              Créer un compte gratuit
            </Link>
          </p>

          {/* Accès rapide démo */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide text-center mb-3">
              Comptes de démo (mot de passe : demo1234)
            </p>
            <div className="grid grid-cols-4 gap-2">
              {COMPTES_DEMO.map(({ u, label }) => (
                <button key={u} type="button" onClick={() => remplirDemo(u)} title={u}
                  className="text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-ocean-50 hover:text-ocean-700
                             border border-slate-200 hover:border-ocean-200 rounded-lg py-2 px-1 transition-all">
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { LogIn, User, Lock } from "lucide-react";
// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//   const [form, setForm] = useState({ username: "", password: "" });
//   const [erreur, setErreur] = useState("");
//   const [chargement, setChargement] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const soumettre = async (e) => {
//     e.preventDefault();
//     setChargement(true);
//     try {
//       await login(form.username, form.password);
//       navigate("/");
//     } catch {
//       setErreur("Identifiants incorrects.");
//     } finally {
//       setChargement(false);
//     }
//   };

//   return (
//     <div className="conteneur">
//       <div className="form-box">
//         <div className="text-center mb-6">
//           <div className="w-14 h-14 mx-auto rounded-2xl bg-ocean-100 flex items-center justify-center mb-3">
//             <LogIn className="text-ocean-700" size={24} />
//           </div>
//           <h2>Bon retour 👋</h2>
//           <p className="text-slate-500 text-sm mt-1">Connectez-vous à votre compte TerreMerGn</p>
//         </div>

//         {erreur && <p className="erreur">{erreur}</p>}

//         <form onSubmit={soumettre} className="space-y-4">
//           <div>
//             <label htmlFor="username">Nom d'utilisateur</label>
//             <div className="relative">
//               <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//               <input
//                 id="username" className="pl-9"
//                 type="text" placeholder="   Nom d'utilisateur"
//                 value={form.username}
//                 onChange={(e) => setForm({ ...form, username: e.target.value })}
//                 required
//               />
//             </div>
//           </div>
//           <div>
//             <label htmlFor="password">Mot de passe</label>
//             <div className="relative">
//               <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//               <input
//                 id="password" type="password" className="pl-9" placeholder="   Mot de passe"
//                 value={form.password}
//                 onChange={(e) => setForm({ ...form, password: e.target.value })}
//                 required
//               />
//             </div>
//           </div>
//           <button className="btn-primaire w-full" type="submit" disabled={chargement}>
//             {chargement ? "Connexion…" : "Se connecter"}
//           </button>
//         </form>

//         <p className="text-center text-sm text-slate-500 mt-6">
//           Pas de compte ?{" "}
//           <Link to="/register" className="text-ocean-700 font-semibold hover:underline">
//             Créer un compte
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }








// // import { useState } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";

// // export default function Login() {
// //   const [form, setForm] = useState({ username: "", password: "" });
// //   const [erreur, setErreur] = useState("");
// //   const { login } = useAuth();
// //   const navigate = useNavigate();

// //   const soumettre = async (e) => {
// //     e.preventDefault();
// //     try {
// //       await login(form.username, form.password);
// //       navigate("/");
// //     } catch {
// //       setErreur("Identifiants incorrects. Réessayez.");
// //     }
// //   };

// //   return (
// //     <div className="form-box">
// //       <h2>Connexion</h2>
// //       {erreur && <p className="erreur">{erreur}</p>}
// //       <form onSubmit={soumettre}>
// //         <input placeholder="Nom d'utilisateur" value={form.username}
// //           onChange={(e) => setForm({ ...form, username: e.target.value })} required />
// //         <input type="password" placeholder="Mot de passe" value={form.password}
// //           onChange={(e) => setForm({ ...form, password: e.target.value })} required />
// //         <button className="btn-primaire" type="submit">Se connecter</button>
// //       </form>
// //       <p>Pas de compte ? <Link to="/register">S'inscrire</Link></p>
// //     </div>
// //   );
// // }
