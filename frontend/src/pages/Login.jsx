import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, User, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const soumettre = async (e) => {
    e.preventDefault();
    setChargement(true);
    try {
      await login(form.username, form.password);
      navigate("/");
    } catch {
      setErreur("Identifiants incorrects.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="conteneur">
      <div className="form-box">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-ocean-100 flex items-center justify-center mb-3">
            <LogIn className="text-ocean-700" size={24} />
          </div>
          <h2>Bon retour 👋</h2>
          <p className="text-slate-500 text-sm mt-1">Connectez-vous à votre compte TerreMerGn</p>
        </div>

        {erreur && <p className="erreur">{erreur}</p>}

        <form onSubmit={soumettre} className="space-y-4">
          <div>
            <label htmlFor="username">Nom d'utilisateur</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="username" className="pl-9"
                type="text" placeholder="   Nom d'utilisateur"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="password">Mot de passe</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="password" type="password" className="pl-9" placeholder="   Mot de passe"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </div>
          <button className="btn-primaire w-full" type="submit" disabled={chargement}>
            {chargement ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Pas de compte ?{" "}
          <Link to="/register" className="text-ocean-700 font-semibold hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}








// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//   const [form, setForm] = useState({ username: "", password: "" });
//   const [erreur, setErreur] = useState("");
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const soumettre = async (e) => {
//     e.preventDefault();
//     try {
//       await login(form.username, form.password);
//       navigate("/");
//     } catch {
//       setErreur("Identifiants incorrects. Réessayez.");
//     }
//   };

//   return (
//     <div className="form-box">
//       <h2>Connexion</h2>
//       {erreur && <p className="erreur">{erreur}</p>}
//       <form onSubmit={soumettre}>
//         <input placeholder="Nom d'utilisateur" value={form.username}
//           onChange={(e) => setForm({ ...form, username: e.target.value })} required />
//         <input type="password" placeholder="Mot de passe" value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })} required />
//         <button className="btn-primaire" type="submit">Se connecter</button>
//       </form>
//       <p>Pas de compte ? <Link to="/register">S'inscrire</Link></p>
//     </div>
//   );
// }
