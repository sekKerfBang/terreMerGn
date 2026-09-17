import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, ArrowRight, ArrowLeft, Check, Fish, Beef, Wheat, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { val: "PECHEUR", lib: "Pêcheur", emoji: "🐟", icon: Fish, desc: "Je vends du poisson" },
  { val: "ELEVAGE", lib: "Éleveur", emoji: "🐄", icon: Beef, desc: "Je vole volailles, bétail…" },
  { val: "AGRICULTURE", lib: "Agriculteur", emoji: "🌾", icon: Wheat, desc: "Je vends des récoltes" },
  { val: "ACHETEUR", lib: "Acheteur", emoji: "🛒", icon: ShoppingCart, desc: "Je veux acheter" },
];

const forceMdp = (mdp) => {
  let s = 0;
  if (mdp.length >= 6) s++;
  if (mdp.length >= 10) s++;
  if (/[A-Z]/.test(mdp) && /[a-z]/.test(mdp)) s++;
  if (/[0-9]/.test(mdp)) s++;
  return s;
};
const NIVEAUX = ["", "Faible", "Moyen", "Bon", "Fort"];
const COULEURS = ["", "bg-red-400", "bg-terre-400", "bg-lagune-400", "bg-ocean-500"];

export default function Register() {
  const [etape, setEtape] = useState(1);
  const [form, setForm] = useState({
    username: "", email: "", password: "", first_name: "", last_name: "",
    telephone: "", localite: "", role: "ACHETEUR",
  });
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const maj = (c) => (e) => setForm({ ...form, [c]: e.target.value });
  const force = forceMdp(form.password);

  const etape1Valide = form.username.trim().length >= 3 && form.password.length >= 6;

  const continuer = () => {
    if (!etape1Valide) {
      setErreur("Pseudo requis (3 caractères min.) et mot de passe de 6 caractères min.");
      return;
    }
    setErreur("");
    setEtape(2);
  };

  const soumettre = async (e) => {
    e.preventDefault();
    setChargement(true);
    setErreur("");
    try {
      await register(form);
      toast.success("Bienvenue sur TerreMerGn ! 🎉");
      navigate("/");
    } catch (err) {
      const d = err.response?.data;
      setErreur(d ? Object.values(d).flat().join(" ") : "Inscription impossible. Réessayez.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="conteneur">
      <div className="form-box large !max-w-3xl">
        {/* En-tête avec stepper */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-lagune-100 flex items-center justify-center mb-4">
            <UserPlus className="text-lagune-700" size={24} />
          </div>
          <h2>Rejoindre TerreMerGn</h2>
          <p className="text-slate-500 text-sm mt-1">Créez votre compte en moins d'une minute</p>

          <div className="flex items-center justify-center gap-0 mt-6">
            {["Identité", "Profil"].map((t, i) => (
              <div key={t} className="flex items-center">
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                    ${etape > i + 1 ? "bg-ocean-600 text-white" : etape === i + 1 ? "bg-ocean-700 text-white ring-4 ring-ocean-100" : "bg-slate-100 text-slate-400"}`}>
                    {etape > i + 1 ? <Check size={15} /> : i + 1}
                  </span>
                  <span className={`text-sm font-semibold ${etape === i + 1 ? "text-encre" : "text-slate-400"}`}>{t}</span>
                </div>
                {i === 0 && <div className={`w-16 md:w-28 h-0.5 mx-3 ${etape > 1 ? "bg-ocean-500" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        {erreur && <p className="erreur mb-5">{erreur}</p>}

        <form onSubmit={soumettre} className="space-y-5">
          {etape === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label>Prénom</label>
                  <input value={form.first_name} type="text" placeholder="Fatou" onChange={maj("first_name")} /></div>
                <div><label>Nom</label>
                  <input value={form.last_name} type="text" placeholder="Camara" onChange={maj("last_name")} /></div>
              </div>
              <div><label>Nom d'utilisateur *</label>
                <input value={form.username} type="text" placeholder="fatou2026" onChange={maj("username")} required /></div>
              <div><label>Email</label>
                <input type="email" placeholder="fatou@exemple.com" value={form.email} onChange={maj("email")} /></div>
              <div>
                <label>Mot de passe * (6 caractères min.)</label>
                <input type="password" placeholder="••••••••" value={form.password}
                  onChange={maj("password")} minLength={6} required />
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((n) => (
                        <div key={n} className={`h-1.5 flex-1 rounded-full transition-colors ${n <= force ? COULEURS[force] : "bg-slate-100"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Force : {NIVEAUX[force]}</p>
                  </div>
                )}
              </div>
              <button type="button" onClick={continuer} className="btn-primaire w-full !py-3">
                Continuer <ArrowRight size={17} />
              </button>
            </div>
          )}

          {etape === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label>Téléphone</label>
                  <input value={form.telephone} type="tel" placeholder="+224 6XX XX XX XX" onChange={maj("telephone")} /></div>
                <div><label>Localité</label>
                  <input value={form.localite} type="text" placeholder="Conakry, Kindia, Kankan…" onChange={maj("localite")} /></div>
              </div>

              <div>
                <label>Vous êtes : *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {ROLES.map(({ val, lib, emoji, icon: Icon, desc }) => (
                    <button type="button" key={val}
                      onClick={() => setForm({ ...form, role: val })}
                      className={`p-4 rounded-2xl border-2 text-center transition-all duration-200 ${
                        form.role === val
                          ? "border-ocean-600 bg-ocean-50 shadow-soft"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}>
                      <span className="text-2xl">{emoji}</span>
                      <div className="font-bold text-sm mt-1.5 flex items-center justify-center gap-1">
                        <Icon size={13} className={form.role === val ? "text-ocean-700" : "text-slate-400"} />
                        {lib}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setEtape(1)} className="btn-secondaire flex-1">
                  <ArrowLeft size={16} /> Retour
                </button>
                <button className="btn-primaire flex-[2] !py-3" type="submit" disabled={chargement}>
                  {chargement ? (
                    <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  ) : (
                    <>Créer mon compte <ArrowRight size={17} /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Déjà inscrit ?{" "}
          <Link to="/login" className="text-ocean-700 font-bold hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}








// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { UserPlus } from "lucide-react";
// import { useAuth } from "../context/AuthContext";

// const ROLES = [
//   ["PECHEUR", "🐟 Pêcheur"],
//   ["ELEVAGE", "🐄 Éleveur"],
//   ["AGRICULTURE", "🌾 Agriculteur"],
//   ["ACHETEUR", "🛒 Acheteur"],
// ];

// export default function Register() {
//   const [form, setForm] = useState({
//     username: "", email: "", password: "", first_name: "", last_name: "",
//     telephone: "", localite: "", role: "ACHETEUR",
//   });
//   const [erreur, setErreur] = useState("");
//   const [chargement, setChargement] = useState(false);
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const soumettre = async (e) => {
//     e.preventDefault();
//     setChargement(true);
//     try {
//       await register(form);
//       navigate("/");
//     } catch (err) {
//       const d = err.response?.data;
//       setErreur(d ? Object.values(d).flat().join(" ") : "Inscription impossible.");
//     } finally {
//       setChargement(false);
//     }
//   };

//   const maj = (c) => (e) => setForm({ ...form, [c]: e.target.value });

//   return (
//     <div className="conteneur">
//       <div className="form-box large">
//         <div className="text-center mb-6">
//           <div className="w-14 h-14 mx-auto rounded-2xl bg-lagune-100 flex items-center justify-center mb-3">
//             <UserPlus className="text-lagune-700" size={24} />
//           </div>
//           <h2>Rejoindre TerreMerGn</h2>
//           <p className="text-slate-500 text-sm mt-1">Créez votre compte en 30 secondes</p>
//         </div>

//         {erreur && <p className="erreur">{erreur}</p>}

//         <form onSubmit={soumettre} className="space-y-4">
//           <div className="ligne-2">
//             <div><label>Prénom</label><input value={form.first_name} type="text" placeholder="   Prénom" onChange={maj("first_name")} /></div>
//             <div><label>Nom</label><input value={form.last_name} type="text" placeholder="   Nom" onChange={maj("last_name")} /></div>
//           </div>
//           <div><label>Nom d'utilisateur *</label>
//             <input value={form.username} type="text" placeholder="   Nom d'utilisateur" onChange={maj("username")} required /></div>
//           <div><label>Email</label>
//             <input type="email" placeholder="   Email" value={form.email} onChange={maj("email")} /></div>
//           <div><label>Mot de passe * (min. 6 caractères)</label>
//             <input type="password" placeholder="   Mot de passe" value={form.password} onChange={maj("password")} minLength={6} required /></div>
//           <div className="ligne-2">
//             <div><label>Téléphone</label><input value={form.telephone} type="tel" onChange={maj("telephone")} placeholder="+224 6XX XX XX XX" /></div>
//             <div><label>Localité</label><input value={form.localite} type="text" placeholder="   Localité" onChange={maj("localite")} /></div>
//           </div>

//           <div>
//             <label>Vous êtes :</label>
//             <div className="choix-roles">
//               {ROLES.map(([val, lib]) => (
//                 <button
//                   type="button" key={val}
//                   className={form.role === val ? "role-actif" : ""}
//                   onClick={() => setForm({ ...form, role: val })}
//                 >{lib}</button>
//               ))}
//             </div>
//           </div>

//           <button className="btn-primaire w-full" type="submit" disabled={chargement}>
//             {chargement ? "Création…" : "Créer mon compte"}
//           </button>
//         </form>

//         <p className="text-center text-sm text-slate-500 mt-6">
//           Déjà inscrit ? <Link to="/login" className="text-ocean-700 font-semibold hover:underline">Se connecter</Link>
//         </p>
//       </div>
//     </div>
//   );
// }







// // import { useState } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // // import { useAuth } from "../context/AuthContext";
// // import { type } from '../../node_modules/arg/index.d';

// // const ROLES = [
// //   ["PECHEUR", "🐟 Pêcheur"], ["ELEVAGE", "🐄 Éleveur"],
// //   ["AGRICULTURE", "🌾 Agriculteur"], ["ACHETEUR", "🛒 Acheteur"],
// // ];

// // export default function Register() {
// //   const [form, setForm] = useState({
// //     username: "", email: "", password: "", first_name: "", last_name: "",
// //     telephone: "", localite: "", role: "ACHETEUR",
// //   });
// //   const [erreur, setErreur] = useState("");
// //   const { register } = useAuth();
// //   const navigate = useNavigate();

// //   const soumettre = async (e) => {
// //     e.preventDefault();
// //     try {
// //       await register(form);
// //       navigate("/");
// //     } catch (err) {
// //       setErreur("Inscription impossible. Vérifiez les champs (pseudo déjà pris ?).");
// //     }
// //   };

// //   const maj = (champ) => (e) => setForm({ ...form, [champ]: e.target.value });

// //   return (
// //     <div className="form-box">
// //       <h2>Créer un compte</h2>
// //       {erreur && <p className="erreur">{erreur}</p>}
// //       <form onSubmit={soumettre}>
// //         <div className="ligne-2">
// //           <input placeholder="Prénom" value={form.first_name} onChange={maj("first_name")} />
// //           <input placeholder="Nom" value={form.last_name} onChange={maj("last_name")} />
// //         </div>
// //         <input placeholder="Nom d'utilisateur *" value={form.username}
// //           onChange={maj("username")} required />
// //         <input type="email" placeholder="Email" value={form.email} onChange={maj("email")} />
// //         <input type="password" placeholder="Mot de passe * (min. 6 caractères)"
// //           value={form.password} onChange={maj("password")} required />
// //         <div className="ligne-2">
// //           <input placeholder="Téléphone" value={form.telephone} onChange={maj("telephone")} />
// //           <input placeholder="Localité (ex: Conakry, Kankan…)"
// //             value={form.localite} onChange={maj("localite")} />
// //         </div>
// //         <label>Vous êtes :</label>
// //         <div className="choix-roles">
// //           {ROLES.map(([val, lib]) => (
// //             <button type="button" key={val}
// //               className={form.role === val ? "role-actif" : ""}
// //               onClick={() => setForm({ ...form, role: val })}>
// //               {lib}
// //             </button>
// //           ))}
// //         </div>
// //         <button className="btn-primaire" type="submit">S'inscrire</button>
// //       </form>
// //       <p>Déjà inscrit ? <Link to="/login">Se connecter</Link></p>
// //     </div>
// //   );
// // }
