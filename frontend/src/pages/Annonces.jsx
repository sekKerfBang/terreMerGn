import { useEffect, useState } from "react";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import api from "../api";
import AnnonceCard from "../components/AnnonceCard";

const SECTEURS = [
  ["", "Tous les secteurs"],
  ["PECHE", "🐟 Pêche"],
  ["ELEVAGE", "🐄 Élevage"],
  ["AGRICULTURE", "🌾 Agriculture"],
];

export default function Annonces() {
  const [annonces, setAnnonces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtres, setFiltres] = useState({
    secteur: "", recherche: "", categorie: "", localite: "",
  });

  useEffect(() => {
    api.get("/annonces/categories/").then((res) => setCategories(res.data.results || res.data));
  }, []);

  useEffect(() => {
    setChargement(true);
    const params = new URLSearchParams();
    if (filtres.secteur) params.set("categorie__secteur", filtres.secteur);
    if (filtres.recherche) params.set("search", filtres.recherche);
    if (filtres.categorie) params.set("categorie", filtres.categorie);
    if (filtres.localite) params.set("localite", filtres.localite);
    api.get(`/annonces/?${params}`)
      .then((res) => setAnnonces(res.data.results || res.data))
      .finally(() => setChargement(false));
  }, [filtres]);

  return (
    <div className="conteneur">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Marché</h1>
          <p className="text-slate-500 mt-1">
            {annonces.length} annonce{annonces.length > 1 ? "s" : ""} disponible{annonces.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-slate-400">
          <SlidersHorizontal size={18} />
          <span className="text-sm">Filtres</span>
        </div>
      </div>

      <div className="filtres">
        <div className="relative md:col-span-2">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="pl-10"
            placeholder="Rechercher : poisson, riz, poulet…"
            value={filtres.recherche}
            onChange={(e) => setFiltres({ ...filtres, recherche: e.target.value })}
          />
        </div>
        <select
          value={filtres.secteur}
          onChange={(e) => setFiltres({ ...filtres, secteur: e.target.value })}
        >
          {SECTEURS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <div className="relative">
          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="pl-9"
            placeholder="Localité"
            value={filtres.localite}
            onChange={(e) => setFiltres({ ...filtres, localite: e.target.value })}
          />
        </div>
      </div>

      {chargement ? (
        <div className="grille">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="carte animate-pulse">
              <div className="h-48 bg-slate-100 rounded-t-2xl" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-slate-100 rounded w-1/3" />
                <div className="h-4 bg-slate-100 rounded w-4/5" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : annonces.length === 0 ? (
        <div className="carte p-12 text-center">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="text-slate-600">Aucune annonce trouvée</h3>
          <p className="text-slate-400 text-sm mt-2">Essayez d'autres filtres ou termes de recherche.</p>
        </div>
      ) : (
        <div className="grille">
          {annonces.map((a) => <AnnonceCard key={a.id} annonce={a} />)}
        </div>
      )}
    </div>
  );
}







// import { useEffect, useState } from "react";
// import api from "../api";
// import AnnonceCard from "../components/AnnonceCard";

// const SECTEURS = [["", "Tous les secteurs"], ["PECHE", "🐟 Pêche"],
//   ["ELEVAGE", "🐄 Élevage"], ["AGRICULTURE", "🌾 Agriculture"]];

// export default function Annonces() {
//   const [annonces, setAnnonces] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [filtres, setFiltres] = useState({ secteur: "", recherche: "", localite: "" });

//   useEffect(() => {
//     api.get("/annonces/categories/").then((res) => setCategories(res.data));
//   }, []);

//   useEffect(() => {
//     const params = new URLSearchParams();
//     if (filtres.secteur) params.set("categorie__secteur", filtres.secteur);
//     if (filtres.recherche) params.set("search", filtres.recherche);
//     if (filtres.localite) params.set("localite", filtres.localite);
//     api.get(`/annonces/?${params}`).then((res) => setAnnonces(res.data));
//   }, [filtres]);

//   return (
//     <div>
//       <h2>Annonces</h2>
//       <div className="filtres">
//         <input placeholder="🔍 Rechercher (ex: poisson, riz…)"
//           value={filtres.recherche}
//           onChange={(e) => setFiltres({ ...filtres, recherche: e.target.value })} />
//         <select value={filtres.secteur}
//           onChange={(e) => setFiltres({ ...filtres, secteur: e.target.value })}>
//           {SECTEURS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
//         </select>
//         <select value={filtres.categorie}
//           onChange={(e) => setFiltres({ ...filtres, categorie: e.target.value })}>
//           <option value="">Toutes les catégories</option>
//           {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
//         </select>
//         <input placeholder="📍 Localité"
//           value={filtres.localite}
//           onChange={(e) => setFiltres({ ...filtres, localite: e.target.value })} />
//       </div>
//       {annonces.length === 0
//         ? <p className="centrer">Aucune annonce trouvée.</p>
//         : <div className="grille">
//             {annonces.map((a) => <AnnonceCard key={a.id} annonce={a} />)}
//           </div>}
//     </div>
//   );
// }
