import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MapPin, Phone, MessageSquare, Edit3, Trash2, ShoppingCart, ArrowLeft, ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import AnnonceCard from "../components/AnnonceCard";
import { formatPrix, tempsRelatif, SECTEUR_EMOJI } from "../utils";

export default function AnnonceDetail() {
  const { id } = useParams();
  const [annonce, setAnnonce] = useState(null);
  const [similaires, setSimilaires] = useState([]);
  const [suppression, setSuppression] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setAnnonce(null);
    api.get(`/annonces/${id}/`).then((res) => {
      setAnnonce(res.data);
      // Annonces similaires : même secteur, autres que celle-ci
      const secteur = res.data.categorie?.secteur;
      if (secteur) {
        api.get(`/annonces/?categorie__secteur=${secteur}&ordering=-cree_le`)
          .then((r) => {
            const data = (r.data.results || r.data).filter((a) => a.id !== res.data.id);
            setSimilaires(data.slice(0, 4));
          })
          .catch(() => {});
      }
    }).catch(() => navigate("/annonces"));
  }, [id, navigate]);

  if (!annonce) {
    return <div className="conteneur py-24 flex justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-ocean-100 border-t-ocean-600 animate-spin" />
    </div>;
  }

  const estAuteur = user && annonce.auteur?.id === user.id;

  const supprimer = async () => {
    if (!confirm("Supprimer définitivement cette annonce ?")) return;
    setSuppression(true);
    try {
      await api.delete(`/annonces/${annonce.id}/`);
      toast.success("Annonce supprimée.");
      navigate("/annonces");
    } catch {
      toast.error("Suppression impossible.");
      setSuppression(false);
    }
  };

  const contacter = async () => {
    try {
      await api.post("/messages/envoyer/", {
        destinataire: annonce.auteur.id,
        annonce: annonce.id,
        contenu: `Bonjour, je suis intéressé par votre annonce "${annonce.titre}". Est-elle toujours disponible ?`,
      });
      navigate(`/messages/${annonce.auteur.id}`);
    } catch {
      toast.error("Impossible d'envoyer le message.");
    }
  };

  return (
    <div>
      <Link to="/annonces" className="btn-ghost mb-4 -ml-2">
        <ArrowLeft size={16} /> Retour au marché
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-6 items-start">
        {/* ===== Image ===== */}
        <div className="carte overflow-hidden group">
          {annonce.image ? (
            <img src={annonce.image} alt={annonce.titre}
              className="w-full max-h-[540px] object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="h-[340px] md:h-[480px] flex items-center justify-center text-8xl
                            bg-gradient-to-br from-ocean-50 via-lagune-50 to-terre-50">
              {SECTEUR_EMOJI[annonce.categorie?.secteur] || "🌍"}
            </div>
          )}
        </div>

        {/* ===== Colonne infos (sticky) ===== */}
        <div className="space-y-5 lg:sticky lg:top-24">
          <div className="carte p-6 animate-fade-up">
            <div className="flex items-center gap-2">
              <span className="badge-secteur">{annonce.categorie?.nom}</span>
              <span className="badge">{tempsRelatif(annonce.cree_le)}</span>
            </div>
            <h1 className="!text-2xl mt-3">{annonce.titre}</h1>
            <p className="prix grand !mt-3">
              {formatPrix(annonce.prix)}
              <span className="text-slate-400 text-base font-normal"> / {annonce.unite}</span>
            </p>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <dt className="text-slate-500">Quantité disponible</dt>
                <dd className="font-semibold">{annonce.quantite} {annonce.unite}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <dt className="text-slate-500">Localité</dt>
                <dd className="font-semibold flex items-center gap-1">
                  <MapPin size={14} className="text-ocean-600" /> {annonce.localite}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Statut</dt>
                <dd>
                  <span className={`badge badge-statut-${annonce.statut.toLowerCase()}`}>
                    {annonce.statut}
                  </span>
                </dd>
              </div>
            </dl>

            {annonce.description && (
              <div className="mt-6 pt-5 border-t border-slate-100">
                <h3 className="text-base mb-2">Description</h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {annonce.description}
                </p>
              </div>
            )}
          </div>

          {/* Vendeur */}
          <div className="carte p-6 animate-fade-up">
            <h3 className="text-base mb-4">Vendeur</h3>
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-full bg-ocean-700 text-white flex items-center justify-center font-bold">
                {(annonce.auteur?.first_name?.[0] || annonce.auteur?.username?.[0] || "?").toUpperCase()}
              </span>
              <div>
                <div className="font-bold">
                  {annonce.auteur?.first_name} {annonce.auteur?.last_name}
                </div>
                <div className="text-xs text-slate-500">{annonce.auteur?.role_display}</div>
              </div>
            </div>
            {annonce.auteur?.telephone && (
              <a href={`tel:${annonce.auteur.telephone}`}
                className="mt-4 flex items-center gap-2 text-sm font-semibold text-ocean-700 hover:text-ocean-900">
                <Phone size={16} /> {annonce.auteur.telephone}
              </a>
            )}

            <div className="mt-6 space-y-2">
              {estAuteur ? (
                <div className="flex gap-2">
                  <Link to={`/annonces/${annonce.id}/modifier`} className="btn-secondaire flex-1">
                    <Edit3 size={16} /> Modifier
                  </Link>
                  <button onClick={supprimer} disabled={suppression} className="btn-danger !px-4">
                    {suppression
                      ? <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      : <Trash2 size={16} />}
                  </button>
                </div>
              ) : user ? (
                <>
                  <Link to={`/paiement/${annonce.id}`} className="btn-primaire w-full !py-3">
                    <ShoppingCart size={17} /> Acheter maintenant
                  </Link>
                  <button onClick={contacter} className="btn-secondaire w-full !py-3">
                    <MessageSquare size={16} /> Contacter le vendeur
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn-primaire w-full !py-3">
                  Connectez-vous pour acheter
                </Link>
              )}
            </div>

            <p className="text-xs text-slate-400 text-center mt-4 flex items-center justify-center gap-1.5">
              <ShieldCheck size={12} /> Transaction protégée par TerreMerGn
            </p>
          </div>
        </div>
      </div>

      {/* ===== Similaires ===== */}
      {similaires.length > 0 && (
        <section className="mt-14">
          <h2 className="!text-xl mb-5">Annonces similaires</h2>
          <div className="grille">
            {similaires.map((a) => <AnnonceCard key={a.id} annonce={a} />)}
          </div>
        </section>
      )}
    </div>
  );
}







// import { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { MapPin, Phone, MessageSquare, Edit3, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
// import api from "../api";
// import { useAuth } from "../context/AuthContext";

// export default function AnnonceDetail() {
//   const { id } = useParams();
//   const [annonce, setAnnonce] = useState(null);
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     api.get(`/annonces/${id}/`).then((res) => setAnnonce(res.data))
//       .catch(() => navigate("/annonces"));
//   }, [id, navigate]);

//   if (!annonce) return <div className="conteneur centrer">Chargement…</div>;
//   const estAuteur = user && annonce.auteur?.id === user.id;

//   const supprimer = async () => {
//     if (!confirm("Supprimer cette annonce ?")) return;
//     await api.delete(`/annonces/${annonce.id}/`);
//     navigate("/annonces");
//   };

//   const contacter = async () => {
//     await api.post("/messages/envoyer/", {
//       destinataire: annonce.auteur.id,
//       annonce: annonce.id,
//       contenu: `Bonjour, je suis intéressé par votre annonce "${annonce.titre}". Est-elle toujours disponible ?`,
//     });
//     navigate(`/messages/${annonce.auteur.id}`);
//   };

//   return (
//     <div className="conteneur">
//       <Link to="/annonces" className="btn-ghost mb-4 -ml-2">
//         <ArrowLeft size={16} /> Retour au marché
//       </Link>

//       <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
//         {/* IMAGE */}
//         <div className="carte overflow-hidden">
//           {annonce.image ? (
//             <img src={annonce.image} alt={annonce.titre} className="w-full h-full max-h-[560px] object-cover" />
//           ) : (
//             <div className="h-[400px] md:h-[560px] flex items-center justify-center text-8xl bg-gradient-to-br from-ocean-50 to-lagune-50">
//               🌍
//             </div>
//           )}
//         </div>

//         {/* INFOS */}
//         <div className="space-y-5">
//           <div className="carte p-6">
//             <span className="badge-secteur">{annonce.categorie?.nom}</span>
//             <h1 className="mt-3">{annonce.titre}</h1>
//             <p className="prix grand mt-4">
//               {Number(annonce.prix).toLocaleString("fr-FR")} <span className="text-xl">GNF</span>
//               <span className="text-slate-400 text-base font-normal"> / {annonce.unite}</span>
//             </p>

//             <dl className="mt-5 space-y-3 text-sm">
//               <div className="flex justify-between border-b border-slate-100 pb-2">
//                 <dt className="text-slate-500">Quantité disponible</dt>
//                 <dd className="font-semibold">{annonce.quantite} {annonce.unite}</dd>
//               </div>
//               <div className="flex justify-between border-b border-slate-100 pb-2">
//                 <dt className="text-slate-500">Localité</dt>
//                 <dd className="font-semibold flex items-center gap-1">
//                   <MapPin size={14} /> {annonce.localite}
//                 </dd>
//               </div>
//               <div className="flex justify-between">
//                 <dt className="text-slate-500">Statut</dt>
//                 <dd>
//                   <span className={`badge badge-statut-${annonce.statut.toLowerCase()}`}>
//                     {annonce.statut}
//                   </span>
//                 </dd>
//               </div>
//             </dl>

//             {annonce.description && (
//               <div className="mt-6 pt-5 border-t border-slate-100">
//                 <h3 className="text-base mb-2">Description</h3>
//                 <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
//                   {annonce.description}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* VENDEUR */}
//           <div className="carte p-6">
//             <h3 className="text-base mb-4">Vendeur</h3>
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-full bg-ocean-100 flex items-center justify-center font-bold text-ocean-800">
//                 {(annonce.auteur?.first_name?.[0] || annonce.auteur?.username?.[0] || "?").toUpperCase()}
//               </div>
//               <div>
//                 <div className="font-semibold">
//                   {annonce.auteur?.first_name} {annonce.auteur?.last_name}
//                 </div>
//                 <div className="text-xs text-slate-500">{annonce.auteur?.role_display}</div>
//               </div>
//             </div>
//             {annonce.auteur?.telephone && (
//               <a href={`tel:${annonce.auteur.telephone}`}
//                  className="mt-4 flex items-center gap-2 text-sm text-ocean-700 hover:text-ocean-900">
//                 <Phone size={16} /> {annonce.auteur.telephone}
//               </a>
//             )}

//             {/* ACTIONS */}
//             <div className="mt-6 space-y-2">
//               {estAuteur ? (
//                 <div className="flex gap-2">
//                   <Link to={`/annonces/${annonce.id}/modifier`} className="btn-secondaire flex-1">
//                     <Edit3 size={16} /> Modifier
//                   </Link>
//                   <button onClick={supprimer} className="btn-danger">
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               ) : user ? (
//                 <>
//                   <Link to={`/paiement/${annonce.id}`} className="btn-primaire w-full">
//                     <ShoppingCart size={16} /> Acheter maintenant
//                   </Link>
//                   <button onClick={contacter} className="btn-secondaire w-full">
//                     <MessageSquare size={16} /> Contacter le vendeur
//                   </button>
//                 </>
//               ) : (
//                 <Link to="/login" className="btn-primaire w-full">
//                   Connectez-vous pour acheter
//                 </Link>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






// // import { useEffect, useState } from "react";
// // import { useParams, useNavigate, Link } from "react-router-dom";
// // import api from "../api";
// // import { useAuth } from "../context/AuthContext";

// // export default function AnnonceDetail() {
// //   const { id } = useParams();
// //   const [annonce, setAnnonce] = useState(null);
// //   const { user } = useAuth();
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     api.get(`/annonces/${id}/`).then((res) => setAnnonce(res.data))
// //       .catch(() => navigate("/annonces"));
// //   }, [id]);

// //   if (!annonce) return <p className="centrer">Chargement…</p>;
// //   const estAuteur = user && annonce.auteur.id === user.id;

// //   const supprimer = async () => {
// //     if (!confirm("Supprimer cette annonce ?")) return;
// //     await api.delete(`/annonces/${annonce.id}/`);
// //     navigate("/annonces");
// //   };

// //   const contacter = async () => {
// //     await api.post("/messages/envoyer/", {
// //       destinataire: annonce.auteur.id,
// //       annonce: annonce.id,
// //       contenu: `Bonjour, je suis intéressé par votre annonce "${annonce.titre}". Est-elle toujours disponible ?`,
// //     });
// //     navigate(`/messages/${annonce.auteur.id}`);
// //   };

// //   return (
// //     <div className="detail">
// //       <Link to="/annonces" className="btn-lien">← Retour aux annonces</Link>
// //       <div className="detail-corps">
// //         <div className="detail-image">
// //           {annonce.image
// //             ? <img src={annonce.image} alt={annonce.titre} />
// //             : <div className="img-placeholder grande">🌍</div>}
// //         </div>
// //         <div className="detail-infos">
// //           <span className="badge-secteur">{annonce.categorie.nom}</span>
// //           <h1>{annonce.titre}</h1>
// //           <p className="prix grand">{annonce.prix.toLocaleString("fr-FR")} GNF / {annonce.unite}</p>
// //           <p><strong>Quantité :</strong> {annonce.quantite} {annonce.unite}</p>
// //           <p><strong>Localité :</strong> 📍 {annonce.localite}</p>
// //           <p><strong>Statut :</strong> {annonce.statut}</p>
// //           <p className="description">{annonce.description}</p>
// //           <hr />
// //           <p><strong>Vendeur :</strong> {annonce.auteur.first_name} {annonce.auteur.last_name}
// //             ({annonce.auteur.role_display})</p>
// //           {annonce.auteur.telephone && <p>📞 {annonce.auteur.telephone}</p>}
// //           {estAuteur ? (
// //             <div className="hero-actions">
// //               <Link to={`/annonces/${annonce.id}/modifier`} className="btn-primaire">Modifier</Link>
// //               <button onClick={supprimer} className="btn-danger">Supprimer</button>
// //             </div>
// //           ) : user ? (
// //             <button onClick={contacter} className="btn-primaire">💬 Contacter le vendeur</button>
// //           ) : (
// //             <Link to="/login" className="btn-primaire">Connectez-vous pour contacter</Link>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
