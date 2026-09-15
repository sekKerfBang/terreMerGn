import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  ["PECHEUR", "🐟 Pêcheur"],
  ["ELEVAGE", "🐄 Éleveur"],
  ["AGRICULTURE", "🌾 Agriculteur"],
  ["ACHETEUR", "🛒 Acheteur"],
];

export default function Register() {
  const [form, setForm] = useState({
    username: "", email: "", password: "", first_name: "", last_name: "",
    telephone: "", localite: "", role: "ACHETEUR",
  });
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const soumettre = async (e) => {
    e.preventDefault();
    setChargement(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      const d = err.response?.data;
      setErreur(d ? Object.values(d).flat().join(" ") : "Inscription impossible.");
    } finally {
      setChargement(false);
    }
  };

  const maj = (c) => (e) => setForm({ ...form, [c]: e.target.value });

  return (
    <div className="conteneur">
      <div className="form-box large">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-lagune-100 flex items-center justify-center mb-3">
            <UserPlus className="text-lagune-700" size={24} />
          </div>
          <h2>Rejoindre TerreMerGn</h2>
          <p className="text-slate-500 text-sm mt-1">Créez votre compte en 30 secondes</p>
        </div>

        {erreur && <p className="erreur">{erreur}</p>}

        <form onSubmit={soumettre} className="space-y-4">
          <div className="ligne-2">
            <div><label>Prénom</label><input value={form.first_name} type="text" placeholder="   Prénom" onChange={maj("first_name")} /></div>
            <div><label>Nom</label><input value={form.last_name} type="text" placeholder="   Nom" onChange={maj("last_name")} /></div>
          </div>
          <div><label>Nom d'utilisateur *</label>
            <input value={form.username} type="text" placeholder="   Nom d'utilisateur" onChange={maj("username")} required /></div>
          <div><label>Email</label>
            <input type="email" placeholder="   Email" value={form.email} onChange={maj("email")} /></div>
          <div><label>Mot de passe * (min. 6 caractères)</label>
            <input type="password" placeholder="   Mot de passe" value={form.password} onChange={maj("password")} minLength={6} required /></div>
          <div className="ligne-2">
            <div><label>Téléphone</label><input value={form.telephone} type="tel" onChange={maj("telephone")} placeholder="+224 6XX XX XX XX" /></div>
            <div><label>Localité</label><input value={form.localite} type="text" placeholder="   Localité" onChange={maj("localite")} /></div>
          </div>

          <div>
            <label>Vous êtes :</label>
            <div className="choix-roles">
              {ROLES.map(([val, lib]) => (
                <button
                  type="button" key={val}
                  className={form.role === val ? "role-actif" : ""}
                  onClick={() => setForm({ ...form, role: val })}
                >{lib}</button>
              ))}
            </div>
          </div>

          <button className="btn-primaire w-full" type="submit" disabled={chargement}>
            {chargement ? "Création…" : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Déjà inscrit ? <Link to="/login" className="text-ocean-700 font-semibold hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}







// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";
// import { type } from '../../node_modules/arg/index.d';

// const ROLES = [
//   ["PECHEUR", "🐟 Pêcheur"], ["ELEVAGE", "🐄 Éleveur"],
//   ["AGRICULTURE", "🌾 Agriculteur"], ["ACHETEUR", "🛒 Acheteur"],
// ];

// export default function Register() {
//   const [form, setForm] = useState({
//     username: "", email: "", password: "", first_name: "", last_name: "",
//     telephone: "", localite: "", role: "ACHETEUR",
//   });
//   const [erreur, setErreur] = useState("");
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const soumettre = async (e) => {
//     e.preventDefault();
//     try {
//       await register(form);
//       navigate("/");
//     } catch (err) {
//       setErreur("Inscription impossible. Vérifiez les champs (pseudo déjà pris ?).");
//     }
//   };

//   const maj = (champ) => (e) => setForm({ ...form, [champ]: e.target.value });

//   return (
//     <div className="form-box">
//       <h2>Créer un compte</h2>
//       {erreur && <p className="erreur">{erreur}</p>}
//       <form onSubmit={soumettre}>
//         <div className="ligne-2">
//           <input placeholder="Prénom" value={form.first_name} onChange={maj("first_name")} />
//           <input placeholder="Nom" value={form.last_name} onChange={maj("last_name")} />
//         </div>
//         <input placeholder="Nom d'utilisateur *" value={form.username}
//           onChange={maj("username")} required />
//         <input type="email" placeholder="Email" value={form.email} onChange={maj("email")} />
//         <input type="password" placeholder="Mot de passe * (min. 6 caractères)"
//           value={form.password} onChange={maj("password")} required />
//         <div className="ligne-2">
//           <input placeholder="Téléphone" value={form.telephone} onChange={maj("telephone")} />
//           <input placeholder="Localité (ex: Conakry, Kankan…)"
//             value={form.localite} onChange={maj("localite")} />
//         </div>
//         <label>Vous êtes :</label>
//         <div className="choix-roles">
//           {ROLES.map(([val, lib]) => (
//             <button type="button" key={val}
//               className={form.role === val ? "role-actif" : ""}
//               onClick={() => setForm({ ...form, role: val })}>
//               {lib}
//             </button>
//           ))}
//         </div>
//         <button className="btn-primaire" type="submit">S'inscrire</button>
//       </form>
//       <p>Déjà inscrit ? <Link to="/login">Se connecter</Link></p>
//     </div>
//   );
// }
