import { useEffect, useState } from "react";
import { Users, FileText, CheckCircle2, AlertTriangle, Search } from "lucide-react";
import api from "../api";
import { formatPrix, SECTEUR_EMOJI } from "../utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [annonces, setAnnonces] = useState([]);
  const [filtreStatut, setFiltreStatut] = useState("");
  const [recherche, setRecherche] = useState("");

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

  if (!stats) {
    return <div className="conteneur py-24 flex justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-ocean-100 border-t-ocean-600 animate-spin" />
    </div>;
  }

  const KPIs = [
    { icon: Users, label: "Utilisateurs", val: stats.total_utilisateurs, bg: "bg-ocean-50", fg: "text-ocean-700" },
    { icon: FileText, label: "Annonces", val: stats.total_annonces, bg: "bg-lagune-50", fg: "text-lagune-700" },
    { icon: CheckCircle2, label: "Actives", val: stats.annonces_par_statut["Active"] || 0, bg: "bg-emerald-50", fg: "text-emerald-700" },
    { icon: AlertTriangle, label: "Modérées", val: stats.annonces_par_statut["Modérée"] || 0, bg: "bg-amber-50", fg: "text-amber-700" },
  ];

  const maxRole = Math.max(...Object.values(stats.utilisateurs_par_role), 1);
  const maxSecteur = Math.max(...Object.values(stats.annonces_par_secteur), 1);

  const annoncesFiltrees = annonces.filter((a) =>
    a.titre.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1>Tableau de bord</h1>
        <p className="text-slate-500 mt-1">Vue d'ensemble et modération de la plateforme</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPIs.map(({ icon: Icon, label, val, bg, fg }) => (
          <div key={label} className="carte p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={fg} size={22} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-encre">{val}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Répartitions avec barres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="carte p-6">
          <h3 className="mb-5">Utilisateurs par rôle</h3>
          <div className="space-y-4">
            {Object.entries(stats.utilisateurs_par_role).map(([role, n]) => (
              <div key={role}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-600">{role}</span>
                  <span className="font-bold text-encre">{n}</span>
                </div>
                <div className="barre-progres">
                  <div className="bg-ocean-500" style={{ width: `${(n / maxRole) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="carte p-6">
          <h3 className="mb-5">Annonces par secteur</h3>
          <div className="space-y-4">
            {Object.entries(stats.annonces_par_secteur).map(([secteur, n]) => (
              <div key={secteur}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-600">
                    {SECTEUR_EMOJI[secteur] || "📦"} {secteur}
                  </span>
                  <span className="font-bold text-encre">{n}</span>
                </div>
                <div className="barre-progres">
                  <div className="bg-lagune-500" style={{ width: `${(n / maxSecteur) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modération */}
      <div className="carte overflow-hidden">
        <div className="p-5 flex flex-col md:flex-row md:items-center gap-3 justify-between border-b border-slate-100">
          <h3>Modération des annonces</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search size={15} className="input-icone !left-3" />
              <input className="!pl-9 !py-2 !text-xs !w-48" placeholder="Rechercher…"
                value={recherche} onChange={(e) => setRecherche(e.target.value)} />
            </div>
            <select className="!w-auto !py-2 !text-xs !rounded-lg" value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}>
              <option value="">Tous les statuts</option>
              <option value="ACTIVE">Actives</option>
              <option value="MODEREE">Modérées</option>
              <option value="VENDU">Vendues</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table-admin">
            <thead>
              <tr>
                <th>Titre</th><th>Secteur</th><th>Prix</th><th>Statut</th>
                <th className="!text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {annoncesFiltrees.length === 0 && (
                <tr><td colSpan="5" className="text-center text-slate-400 py-8">Aucune annonce trouvée.</td></tr>
              )}
              {annoncesFiltrees.map((a) => (
                <tr key={a.id}>
                  <td className="font-semibold max-w-[220px] truncate">{a.titre}</td>
                  <td>{SECTEUR_EMOJI[a.secteur] || "📦"} <span className="hidden md:inline">{a.secteur}</span></td>
                  <td className="whitespace-nowrap">{formatPrix(a.prix)}</td>
                  <td>
                    <span className={`badge badge-statut-${a.statut.toLowerCase()}`}>{a.statut}</span>
                  </td>
                  <td className="text-right">
                    {a.statut === "ACTIVE" ? (
                      <button className="btn-danger !text-xs !py-1.5 !px-3 !rounded-lg"
                        onClick={() => moderer(a.id, "MODEREE")}>Modérer</button>
                    ) : (
                      <button className="btn-secondaire !text-xs !py-1.5 !px-3 !rounded-lg"
                        onClick={() => moderer(a.id, "ACTIVE")}>Réactiver</button>
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
// import { Users, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
// import api from "../api";

// const SECTEUR_EMOJI = { PECHE: "🐟", ELEVAGE: "🐄", AGRICULTURE: "🌾" };

// export default function AdminDashboard() {
//   const [stats, setStats] = useState(null);
//   const [annonces, setAnnonces] = useState([]);
//   const [filtreStatut, setFiltreStatut] = useState("");

//   const charger = () => {
//     api.get("/annonces/stats/").then((res) => setStats(res.data));
//     const q = filtreStatut ? `?statut=${filtreStatut}` : "";
//     api.get(`/annonces/${q}`).then((res) => setAnnonces(res.data.results || res.data));
//   };

//   useEffect(charger, [filtreStatut]);

//   const moderer = async (id, statut) => {
//     await api.patch(`/annonces/${id}/`, { statut });
//     charger();
//   };

//   if (!stats) return <div className="conteneur centrer">Chargement…</div>;

//   const KPIs = [
//     { icon: Users, label: "Utilisateurs", val: stats.total_utilisateurs, color: "ocean" },
//     { icon: FileText, label: "Annonces", val: stats.total_annonces, color: "lagune" },
//     { icon: CheckCircle2, label: "Actives", val: stats.annonces_par_statut["Active"] || 0, color: "lagune" },
//     { icon: AlertTriangle, label: "Modérées", val: stats.annonces_par_statut["Modérée"] || 0, color: "terre" },
//   ];

//   return (
//     <div className="conteneur space-y-8">
//       <div>
//         <h1>Tableau de bord</h1>
//         <p className="text-slate-500 mt-1">Vue d'ensemble de la plateforme</p>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {KPIs.map(({ icon: Icon, label, val }) => (
//           <div key={label} className="carte-stat">
//             <Icon className="mx-auto text-ocean-600 mb-2" size={22} />
//             <h3>{val}</h3>
//             <p>{label}</p>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="carte p-6">
//           <h3 className="mb-4">Utilisateurs par rôle</h3>
//           <div className="space-y-3">
//             {Object.entries(stats.utilisateurs_par_role).map(([role, n]) => (
//               <div key={role} className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-slate-600">{role}</span>
//                 <span className="badge">{n}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="carte p-6">
//           <h3 className="mb-4">Annonces par secteur</h3>
//           <div className="space-y-3">
//             {Object.entries(stats.annonces_par_secteur).map(([secteur, n]) => (
//               <div key={secteur} className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-slate-600">
//                   {SECTEUR_EMOJI[secteur] || "📦"} {secteur}
//                 </span>
//                 <span className="badge">{n}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="carte overflow-hidden">
//         <div className="p-5 flex items-center justify-between border-b border-slate-100">
//           <h3>Modération des annonces</h3>
//           <select className="w-auto" value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}>
//             <option value="">Tous les statuts</option>
//             <option value="ACTIVE">Actives</option>
//             <option value="MODEREE">Modérées</option>
//             <option value="VENDU">Vendues</option>
//           </select>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="table-admin">
//             <thead>
//               <tr>
//                 <th>Titre</th><th>Secteur</th><th>Prix</th><th>Statut</th><th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {annonces.map((a) => (
//                 <tr key={a.id}>
//                   <td className="font-medium">{a.titre}</td>
//                   <td>{SECTEUR_EMOJI[a.secteur] || "📦"} {a.secteur}</td>
//                   <td>{Number(a.prix).toLocaleString("fr-FR")} GNF</td>
//                   <td>
//                     <span className={`badge badge-statut-${a.statut.toLowerCase()}`}>{a.statut}</span>
//                   </td>
//                   <td className="text-right">
//                     {a.statut === "ACTIVE" ? (
//                       <button className="btn-danger text-xs py-1.5 px-3" onClick={() => moderer(a.id, "MODEREE")}>
//                         Modérer
//                       </button>
//                     ) : (
//                       <button className="btn-secondaire text-xs py-1.5 px-3" onClick={() => moderer(a.id, "ACTIVE")}>
//                         Réactiver
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }






// // import { useEffect, useState } from "react";
// // import api from "../api";

// // export default function AdminDashboard() {
// //   const [stats, setStats] = useState(null);
// //   const [annonces, setAnnonces] = useState([]);

// //   const charger = () => {
// //     api.get("/annonces/stats/").then((res) => setStats(res.data));
// //     api.get("/annonces/").then((res) => setAnnonces(res.data));
// //   };

// //   useEffect(charger, []);

// //   const moderer = async (id, statut) => {
// //     await api.patch(`/annonces/${id}/`, { statut });
// //     charger();
// //   };

// //   if (!stats) return <p className="centrer">Chargement…</p>;

// //   return (
// //     <div>
// //       <h2>📊 Tableau de bord administrateur</h2>

// //       <div className="stats-grille">
// //         <div className="carte-stat"><h3>{stats.total_utilisateurs}</h3><p>Utilisateurs</p></div>
// //         <div className="carte-stat"><h3>{stats.total_annonces}</h3><p>Annonces</p></div>
// //         <div className="carte-stat"><h3>{stats.annonces_par_statut["Active"] || 0}</h3><p>Actives</p></div>
// //         <div className="carte-stat"><h3>{stats.annonces_par_statut["Modérée"] || 0}</h3><p>Modérées</p></div>
// //       </div>

// //       <h3>Utilisateurs par rôle</h3>
// //       <div className="stats-grille">
// //         {Object.entries(stats.utilisateurs_par_role).map(([role, n]) => (
// //           <div key={role} className="carte-stat"><h3>{n}</h3><p>{role}</p></div>
// //         ))}
// //       </div>

// //       <h3>Annonces par secteur</h3>
// //       <div className="stats-grille">
// //         {Object.entries(stats.annonces_par_secteur).map(([secteur, n]) => (
// //           <div key={secteur} className="carte-stat">
// //             <h3>{{ PECHE: "🐟", ELEVAGE: "🐄", AGRICULTURE: "🌾" }[secteur]}</h3>
// //             <p>{secteur} ({n})</p>
// //           </div>
// //         ))}
// //       </div>

// //       <h3>Modération des annonces</h3>
// //       <table className="table-admin">
// //         <thead>
// //           <tr><th>Titre</th><th>Secteur</th><th>Prix</th><th>Statut</th><th>Actions</th></tr>
// //         </thead>
// //         <tbody>
// //           {annonces.map((a) => (
// //             <tr key={a.id}>
// //               <td>{a.titre}</td>
// //               <td>{{ PECHE: "🐟", ELEVAGE: "🐄", AGRICULTURE: "🌾" }[a.secteur]}</td>
// //               <td>{a.prix.toLocaleString("fr-FR")} GNF</td>
// //               <td><span className={`statut-${a.statut.toLowerCase()}`}>{a.statut}</span></td>
// //               <td>
// //                 {a.statut === "ACTIVE"
// //                   ? <button className="btn-danger" onClick={() => moderer(a.id, "MODEREE")}>Modérer</button>
// //                   : <button className="btn-secondaire" onClick={() => moderer(a.id, "ACTIVE")}>Réactiver</button>}
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // }
