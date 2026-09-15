import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const SECTEURS = { PECHE: "🐟", ELEVAGE: "🐄", AGRICULTURE: "🌾" };

export default function AnnonceCard({ annonce }) {
  return (
    <Link to={`/annonces/${annonce.id}`} className="carte-annonce group">
      {annonce.image ? (
        <img src={annonce.image} alt={annonce.titre} loading="lazy" />
      ) : (
        <div className="img-placeholder">{SECTEURS[annonce.secteur] || "📦"}</div>
      )}
      <div className="carte-corps">
        <span className="badge-secteur">
          {SECTEURS[annonce.secteur]} {annonce.categorie_nom}
        </span>
        <h3>{annonce.titre}</h3>
        <p className="prix">
          {Number(annonce.prix).toLocaleString("fr-FR")} <span className="text-sm font-medium">GNF</span>
          <span className="text-slate-400 font-normal text-sm"> / {annonce.unite}</span>
        </p>
        <p className="meta">
          <MapPin size={14} /> {annonce.localite}
          <span className="text-slate-300 mx-1">·</span>
          <span className="truncate">{annonce.auteur_username}</span>
        </p>
      </div>
    </Link>
  );
}






// import { Link } from "react-router-dom";

// const SECTEURS = { PECHE: "🐟", ELEVAGE: "🐄", AGRICULTURE: "🌾" };

// export default function AnnonceCard({ annonce }) {
//   return (
//     <Link to={`/annonces/${annonce.id}`} className="carte-annonce">
//       {annonce.image
//         ? <img src={annonce.image} alt={annonce.titre} />
//         : <div className="img-placeholder">{SECTEURS[annonce.secteur] || "📦"}</div>}
//       <div className="carte-corps">
//         <span className="badge-secteur">{SECTEURS[annonce.secteur]} {annonce.categorie_nom}</span>
//         <h3>{annonce.titre}</h3>
//         <p className="prix">{annonce.prix.toLocaleString("fr-FR")} GNF / {annonce.unite}</p>
//         <p className="meta">📍 {annonce.localite} · {annonce.auteur_username}</p>
//       </div>
//     </Link>
//   );
// }
