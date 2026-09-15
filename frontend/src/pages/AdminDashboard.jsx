import { useEffect, useState } from "react";
import { Users, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import api from "../api";

const SECTEUR_EMOJI = { PECHE: "🐟", ELEVAGE: "🐄", AGRICULTURE: "🌾" };

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [annonces, setAnnonces] = useState([]);
  const [filtreStatut, setFiltreStatut] = useState("");

  const charger = () => {
    api.get("/annonces/stats/").then((res) => setStats(res.data));
    const q = filtreStatut ? `?statut=${filtreStatut}` : "";
    api.get(`/annonces/${q}`).then((res) => setAnnonces(res.data.results || res.data));
  };

  useEffect(charger, [filtreStatut]);

  const moderer = async (id, statut) => {
    await api.patch(`/annonces/${id}/`, { statut });
    charger();
  };

  if (!stats) return <div className="conteneur centrer">Chargement…</div>;

  const KPIs = [
    { icon: Users, label: "Utilisateurs", val: stats.total_utilisateurs, color: "ocean" },
    { icon: FileText, label: "Annonces", val: stats.total_annonces, color: "lagune" },
    { icon: CheckCircle2, label: "Actives", val: stats.annonces_par_statut["Active"] || 0, color: "lagune" },
    { icon: AlertTriangle, label: "Modérées", val: stats.annonces_par_statut["Modérée"] || 0, color: "terre" },
  ];

  return (
    <div className="conteneur space-y-8">
      <div>
        <h1>Tableau de bord</h1>
        <p className="text-slate-500 mt-1">Vue d'ensemble de la plateforme</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPIs.map(({ icon: Icon, label, val }) => (
          <div key={label} className="carte-stat">
            <Icon className="mx-auto text-ocean-600 mb-2" size={22} />
            <h3>{val}</h3>
            <p>{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="carte p-6">
          <h3 className="mb-4">Utilisateurs par rôle</h3>
          <div className="space-y-3">
            {Object.entries(stats.utilisateurs_par_role).map(([role, n]) => (
              <div key={role} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">{role}</span>
                <span className="badge">{n}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="carte p-6">
          <h3 className="mb-4">Annonces par secteur</h3>
          <div className="space-y-3">
            {Object.entries(stats.annonces_par_secteur).map(([secteur, n]) => (
              <div key={secteur} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  {SECTEUR_EMOJI[secteur] || "📦"} {secteur}
                </span>
                <span className="badge">{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="carte overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <h3>Modération des annonces</h3>
          <select className="w-auto" value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="ACTIVE">Actives</option>
            <option value="MODEREE">Modérées</option>
            <option value="VENDU">Vendues</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="table-admin">
            <thead>
              <tr>
                <th>Titre</th><th>Secteur</th><th>Prix</th><th>Statut</th><th></th>
              </tr>
            </thead>
            <tbody>
              {annonces.map((a) => (
                <tr key={a.id}>
                  <td className="font-medium">{a.titre}</td>
                  <td>{SECTEUR_EMOJI[a.secteur] || "📦"} {a.secteur}</td>
                  <td>{Number(a.prix).toLocaleString("fr-FR")} GNF</td>
                  <td>
                    <span className={`badge badge-statut-${a.statut.toLowerCase()}`}>{a.statut}</span>
                  </td>
                  <td className="text-right">
                    {a.statut === "ACTIVE" ? (
                      <button className="btn-danger text-xs py-1.5 px-3" onClick={() => moderer(a.id, "MODEREE")}>
                        Modérer
                      </button>
                    ) : (
                      <button className="btn-secondaire text-xs py-1.5 px-3" onClick={() => moderer(a.id, "ACTIVE")}>
                        Réactiver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}






// import { useEffect, useState } from "react";
// import api from "../api";

// export default function AdminDashboard() {
//   const [stats, setStats] = useState(null);
//   const [annonces, setAnnonces] = useState([]);

//   const charger = () => {
//     api.get("/annonces/stats/").then((res) => setStats(res.data));
//     api.get("/annonces/").then((res) => setAnnonces(res.data));
//   };

//   useEffect(charger, []);

//   const moderer = async (id, statut) => {
//     await api.patch(`/annonces/${id}/`, { statut });
//     charger();
//   };

//   if (!stats) return <p className="centrer">Chargement…</p>;

//   return (
//     <div>
//       <h2>📊 Tableau de bord administrateur</h2>

//       <div className="stats-grille">
//         <div className="carte-stat"><h3>{stats.total_utilisateurs}</h3><p>Utilisateurs</p></div>
//         <div className="carte-stat"><h3>{stats.total_annonces}</h3><p>Annonces</p></div>
//         <div className="carte-stat"><h3>{stats.annonces_par_statut["Active"] || 0}</h3><p>Actives</p></div>
//         <div className="carte-stat"><h3>{stats.annonces_par_statut["Modérée"] || 0}</h3><p>Modérées</p></div>
//       </div>

//       <h3>Utilisateurs par rôle</h3>
//       <div className="stats-grille">
//         {Object.entries(stats.utilisateurs_par_role).map(([role, n]) => (
//           <div key={role} className="carte-stat"><h3>{n}</h3><p>{role}</p></div>
//         ))}
//       </div>

//       <h3>Annonces par secteur</h3>
//       <div className="stats-grille">
//         {Object.entries(stats.annonces_par_secteur).map(([secteur, n]) => (
//           <div key={secteur} className="carte-stat">
//             <h3>{{ PECHE: "🐟", ELEVAGE: "🐄", AGRICULTURE: "🌾" }[secteur]}</h3>
//             <p>{secteur} ({n})</p>
//           </div>
//         ))}
//       </div>

//       <h3>Modération des annonces</h3>
//       <table className="table-admin">
//         <thead>
//           <tr><th>Titre</th><th>Secteur</th><th>Prix</th><th>Statut</th><th>Actions</th></tr>
//         </thead>
//         <tbody>
//           {annonces.map((a) => (
//             <tr key={a.id}>
//               <td>{a.titre}</td>
//               <td>{{ PECHE: "🐟", ELEVAGE: "🐄", AGRICULTURE: "🌾" }[a.secteur]}</td>
//               <td>{a.prix.toLocaleString("fr-FR")} GNF</td>
//               <td><span className={`statut-${a.statut.toLowerCase()}`}>{a.statut}</span></td>
//               <td>
//                 {a.statut === "ACTIVE"
//                   ? <button className="btn-danger" onClick={() => moderer(a.id, "MODEREE")}>Modérer</button>
//                   : <button className="btn-secondaire" onClick={() => moderer(a.id, "ACTIVE")}>Réactiver</button>}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
