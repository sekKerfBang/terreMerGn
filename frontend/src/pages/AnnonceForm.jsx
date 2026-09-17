import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ImagePlus, X, ArrowLeft, Send } from "lucide-react";
import api from "../api";
import { formatPrix } from "../utils";

const UNITES = ["KG", "TONNE", "PIECE", "LITRE", "SAC", "AUTRE"];

export default function AnnonceForm() {
  const { id } = useParams();
  const modifier = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const [apercu, setApercu] = useState(null);
  const [form, setForm] = useState({
    titre: "", description: "", prix: "", quantite: 1, unite: "KG",
    localite: "", categorie_id: "", image: null,
  });

  useEffect(() => {
    let annule = false;
    api.get("/annonces/categories/")
      .then((res) => {
        if (!annule) setCategories(Array.isArray(res.data) ? res.data : (res.data.results || []));
      })
      .catch(() => setErreur("Impossible de charger les catégories."));

    if (modifier) {
      api.get(`/annonces/${id}/`).then((res) => {
        if (annule) return;
        const a = res.data;
        setForm({
          titre: a.titre || "", description: a.description || "", prix: a.prix || "",
          quantite: a.quantite || 1, unite: a.unite || "KG", localite: a.localite || "",
          categorie_id: a.categorie?.id || "", image: null,
        });
        if (a.image) setApercu(a.image);
      }).catch(() => setErreur("Impossible de charger l'annonce."));
    }
    setChargement(false);
    return () => { annule = true; };
  }, [id, modifier]);

  const choisirImage = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setErreur("Image trop lourde : 5 Mo maximum.");
      return;
    }
    setForm({ ...form, image: f });
    setApercu(URL.createObjectURL(f));
    setErreur("");
  };

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur("");
    setEnvoi(true);
    const data = new FormData();
    Object.entries(form).forEach(([cle, val]) => {
      if (val !== null && val !== "") data.append(cle, val);
    });
    try {
      if (modifier) {
        await api.patch(`/annonces/${id}/`, data, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/annonces/", data, { headers: { "Content-Type": "multipart/form-data" } });
      }
      navigate(modifier ? `/annonces/${id}` : "/annonces");
    } catch (err) {
      const d = err.response?.data;
      setErreur(d ? Object.values(d).flat().join(" ") : "Erreur lors de l'enregistrement.");
    } finally {
      setEnvoi(false);
    }
  };

  const maj = (champ) => (e) => setForm({ ...form, [champ]: e.target.value });

  if (chargement) {
    return <div className="conteneur py-24 flex justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-ocean-100 border-t-ocean-600 animate-spin" />
    </div>;
  }

  return (
    <div className="conteneur">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 -ml-2">
        <ArrowLeft size={16} /> Retour
      </button>

      <div className="carte p-6 md:p-8 max-w-3xl mx-auto animate-fade-up">
        <h2>{modifier ? "Modifier l'annonce" : "Publier une annonce"}</h2>
        <p className="text-slate-500 text-sm mt-1 mb-6">
          {modifier
            ? "Modifiez les informations puis enregistrez."
            : "Remplissez les informations pour mettre votre produit en vente."}
        </p>

        {erreur && <p className="erreur mb-5">{erreur}</p>}

        <form onSubmit={soumettre} encType="multipart/form-data" className="space-y-5">
          {/* Image avec aperçu */}
          <div>
            <label>Photo du produit</label>
            {apercu ? (
              <div className="relative w-full h-52 rounded-2xl overflow-hidden group">
                <img src={apercu} alt="Aperçu" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { setApercu(null); setForm({ ...form, image: null }); }}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center
                             opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 h-40 rounded-2xl border-2 border-dashed
                                border-slate-200 hover:border-ocean-400 hover:bg-ocean-50/50 cursor-pointer transition-all">
                <ImagePlus size={28} className="text-slate-400" />
                <span className="text-sm text-slate-400 font-medium">Cliquez pour ajouter une photo</span>
                <span className="text-xs text-slate-300">JPG, PNG — 5 Mo max.</span>
                <input type="file" accept="image/*" className="hidden" onChange={choisirImage} />
              </label>
            )}
          </div>

          <div>
            <label htmlFor="titre">Titre de l'annonce *</label>
            <input id="titre" type="text" placeholder="Ex : Thon frais pêché ce matin"
              value={form.titre} onChange={maj("titre")} required />
          </div>

          <div>
            <label htmlFor="description">Description détaillée *</label>
            <textarea id="description" rows={5}
              placeholder="Qualité, origine, conditions de vente, possibilité de livraison…"
              value={form.description} onChange={maj("description")} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prix">Prix (GNF) *</label>
              <input id="prix" type="number" min="0" placeholder="35000"
                value={form.prix} onChange={maj("prix")} required />
              {form.prix > 0 && (
                <p className="text-xs text-ocean-700 font-semibold mt-1.5">
                  = {formatPrix(form.prix)} / {form.unite}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="quantite">Quantité *</label>
                <input id="quantite" type="number" min="1" value={form.quantite}
                  onChange={maj("quantite")} required />
              </div>
              <div>
                <label htmlFor="unite">Unité *</label>
                <select id="unite" value={form.unite} onChange={maj("unite")}>
                  {UNITES.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="categorie">Catégorie *</label>
              <select id="categorie" value={form.categorie_id} onChange={maj("categorie_id")} required>
                <option value="">— Choisir —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.secteur_display} — {c.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="localite">Localité *</label>
              <input id="localite" type="text" placeholder="Conakry, Kindia, Kankan…"
                value={form.localite} onChange={maj("localite")} required />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-secondaire flex-1" onClick={() => navigate(-1)}>
              Annuler
            </button>
            <button className="btn-primaire flex-[2] !py-3" type="submit" disabled={envoi}>
              {envoi
                ? <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                : <><Send size={16} /> {modifier ? "Enregistrer" : "Publier l'annonce"}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}










// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../api";

// const UNITES = ["KG", "TONNE", "PIECE", "LITRE", "SAC", "AUTRE"];

// export default function AnnonceForm() {
//   const { id } = useParams();
//   const modifier = Boolean(id);
//   const navigate = useNavigate();

//   const [categories, setCategories] = useState([]);
//   const [chargement, setChargement] = useState(true);
//   const [erreur, setErreur] = useState("");
//   const [form, setForm] = useState({
//     titre: "",
//     description: "",
//     prix: "",
//     quantite: 1,
//     unite: "KG",
//     localite: "",
//     categorie_id: "",
//     image: null,
//   });

//   useEffect(() => {
//     let annule = false;

//     api
//       .get("/annonces/categories/")
//       .then((res) => {
//         if (annule) return;
//         const data = res.data.results || res.data;
//         setCategories(Array.isArray(data) ? data : []);
//       })
//       .catch(() => setErreur("Impossible de charger les catégories."));

//     if (modifier) {
//       api
//         .get(`/annonces/${id}/`)
//         .then((res) => {
//           if (annule) return;
//           const a = res.data;
//           setForm({
//             titre: a.titre || "",
//             description: a.description || "",
//             prix: a.prix || "",
//             quantite: a.quantite || 1,
//             unite: a.unite || "KG",
//             localite: a.localite || "",
//             categorie_id: a.categorie?.id || "",
//             image: null,
//           });
//         })
//         .catch(() => setErreur("Impossible de charger l'annonce."));
//     }

//     setChargement(false);
//     return () => {
//       annule = true;
//     };
//   }, [id, modifier]);

//   const soumettre = async (e) => {
//     e.preventDefault();
//     setErreur("");

//     const data = new FormData();
//     Object.entries(form).forEach(([cle, val]) => {
//       if (val !== null && val !== "") data.append(cle, val);
//     });

//     try {
//       if (modifier) {
//         await api.patch(`/annonces/${id}/`, data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       } else {
//         await api.post("/annonces/", data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }
//       navigate(modifier ? `/annonces/${id}` : "/annonces");
//     } catch (err) {
//       const d = err.response?.data;
//       setErreur(
//         d ? Object.values(d).flat().join(" ") : "Erreur lors de l'enregistrement."
//       );
//     }
//   };

//   const maj = (champ) => (e) =>
//     setForm({ ...form, [champ]: e.target.value });

//   if (chargement) {
//     return <div className="conteneur centrer">Chargement…</div>;
//   }

//   return (
//     <div className="conteneur">
//       <div className="carte p-6 md:p-8 max-w-4xl mx-auto mt-6 animate-fade-up">
//         <h2>{modifier ? "Modifier l'annonce" : "Publier une annonce"}</h2>
//         <p className="text-slate-500 text-sm mt-1 mb-6">
//           {modifier
//             ? "Modifiez les informations puis enregistrez."
//             : "Remplissez les informations pour publier votre annonce sur le marché."}
//         </p>

//         {erreur && <p className="erreur">{erreur}</p>}

//         <form onSubmit={soumettre} encType="multipart/form-data" className="space-y-4">

//           {/* Titre */}
//           <div>
//             <label htmlFor="titre">Titre de l'annonce *</label>
//             <input
//               id="titre"
//               type="text"
//               placeholder="Ex : Thon frais pêché ce matin"
//               value={form.titre}
//               onChange={maj("titre")}
//               required
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label htmlFor="description">Description détaillée *</label>
//             <textarea
//               id="description"
//               rows={5}
//               placeholder="Qualité, origine, conditions de vente, livraison…"
//               value={form.description}
//               onChange={maj("description")}
//               required
//             />
//           </div>

//           {/* Prix à gauche · Quantité + Unité à droite (flex) */}
//           <div className="flex flex-col md:flex-row gap-3">
//             <div className="flex-1">
//               <label htmlFor="prix">Prix (GNF) *</label>
//               <input
//                 id="prix"
//                 type="number"
//                 min="0"
//                 placeholder="35000"
//                 value={form.prix}
//                 onChange={maj("prix")}
//                 required
//               />
//             </div>

//             <div className="flex gap-3 flex-1">
//               <div className="flex-1">
//                 <label htmlFor="quantite">Quantité *</label>
//                 <input
//                   id="quantite"
//                   type="number"
//                   min="1"
//                   value={form.quantite}
//                   onChange={maj("quantite")}
//                   required
//                 />
//               </div>
//               <div className="flex-1">
//                 <label htmlFor="unite">Unité *</label>
//                 <select id="unite" value={form.unite} onChange={maj("unite")}>
//                   {UNITES.map((u) => (
//                     <option key={u} value={u}>{u}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Catégorie */}
//           <div>
//             <label htmlFor="categorie">Catégorie *</label>
//             <select
//               id="categorie"
//               value={form.categorie_id}
//               onChange={maj("categorie_id")}
//               required
//             >
//               <option value="">— Choisir une catégorie —</option>
//               {categories.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.secteur_display} — {c.nom}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Localité */}
//           <div>
//             <label htmlFor="localite">Localité *</label>
//             <input
//               id="localite"
//               type="text"
//               placeholder="Ex : Conakry, Kindia, Kankan…"
//               value={form.localite}
//               onChange={maj("localite")}
//               required
//             />
//           </div>

//           {/* Image */}
//           <div>
//             <label htmlFor="image">Photo (optionnel)</label>
//             <input
//               id="image"
//               type="file"
//               accept="image/*"
//               onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
//             />
//             <p className="text-xs text-slate-400 mt-1">
//               JPG ou PNG, 5 Mo max. Une belle photo augmente vos chances de vente.
//             </p>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-3 pt-2">
//             <button
//               type="button"
//               className="btn-secondaire flex-1"
//               onClick={() => navigate(-1)}
//             >
//               Annuler
//             </button>
//             <button className="btn-primaire flex-1" type="submit">
//               {modifier ? "Enregistrer les modifications" : "Publier l'annonce"}
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// }