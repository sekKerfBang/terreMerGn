import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const UNITES = ["KG", "TONNE", "PIECE", "LITRE", "SAC", "AUTRE"];

export default function AnnonceForm() {
  const { id } = useParams();
  const modifier = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [form, setForm] = useState({
    titre: "",
    description: "",
    prix: "",
    quantite: 1,
    unite: "KG",
    localite: "",
    categorie_id: "",
    image: null,
  });

  useEffect(() => {
    let annule = false;

    api
      .get("/annonces/categories/")
      .then((res) => {
        if (annule) return;
        const data = res.data.results || res.data;
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch(() => setErreur("Impossible de charger les catégories."));

    if (modifier) {
      api
        .get(`/annonces/${id}/`)
        .then((res) => {
          if (annule) return;
          const a = res.data;
          setForm({
            titre: a.titre || "",
            description: a.description || "",
            prix: a.prix || "",
            quantite: a.quantite || 1,
            unite: a.unite || "KG",
            localite: a.localite || "",
            categorie_id: a.categorie?.id || "",
            image: null,
          });
        })
        .catch(() => setErreur("Impossible de charger l'annonce."));
    }

    setChargement(false);
    return () => {
      annule = true;
    };
  }, [id, modifier]);

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur("");

    const data = new FormData();
    Object.entries(form).forEach(([cle, val]) => {
      if (val !== null && val !== "") data.append(cle, val);
    });

    try {
      if (modifier) {
        await api.patch(`/annonces/${id}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/annonces/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate(modifier ? `/annonces/${id}` : "/annonces");
    } catch (err) {
      const d = err.response?.data;
      setErreur(
        d ? Object.values(d).flat().join(" ") : "Erreur lors de l'enregistrement."
      );
    }
  };

  const maj = (champ) => (e) =>
    setForm({ ...form, [champ]: e.target.value });

  if (chargement) {
    return <div className="conteneur centrer">Chargement…</div>;
  }

  return (
    <div className="conteneur">
      <div className="carte p-6 md:p-8 max-w-4xl mx-auto mt-6 animate-fade-up">
        <h2>{modifier ? "Modifier l'annonce" : "Publier une annonce"}</h2>
        <p className="text-slate-500 text-sm mt-1 mb-6">
          {modifier
            ? "Modifiez les informations puis enregistrez."
            : "Remplissez les informations pour publier votre annonce sur le marché."}
        </p>

        {erreur && <p className="erreur">{erreur}</p>}

        <form onSubmit={soumettre} encType="multipart/form-data" className="space-y-4">

          {/* Titre */}
          <div>
            <label htmlFor="titre">Titre de l'annonce *</label>
            <input
              id="titre"
              type="text"
              placeholder="Ex : Thon frais pêché ce matin"
              value={form.titre}
              onChange={maj("titre")}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description">Description détaillée *</label>
            <textarea
              id="description"
              rows={5}
              placeholder="Qualité, origine, conditions de vente, livraison…"
              value={form.description}
              onChange={maj("description")}
              required
            />
          </div>

          {/* Prix à gauche · Quantité + Unité à droite (flex) */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="prix">Prix (GNF) *</label>
              <input
                id="prix"
                type="number"
                min="0"
                placeholder="35000"
                value={form.prix}
                onChange={maj("prix")}
                required
              />
            </div>

            <div className="flex gap-3 flex-1">
              <div className="flex-1">
                <label htmlFor="quantite">Quantité *</label>
                <input
                  id="quantite"
                  type="number"
                  min="1"
                  value={form.quantite}
                  onChange={maj("quantite")}
                  required
                />
              </div>
              <div className="flex-1">
                <label htmlFor="unite">Unité *</label>
                <select id="unite" value={form.unite} onChange={maj("unite")}>
                  {UNITES.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Catégorie */}
          <div>
            <label htmlFor="categorie">Catégorie *</label>
            <select
              id="categorie"
              value={form.categorie_id}
              onChange={maj("categorie_id")}
              required
            >
              <option value="">— Choisir une catégorie —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.secteur_display} — {c.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Localité */}
          <div>
            <label htmlFor="localite">Localité *</label>
            <input
              id="localite"
              type="text"
              placeholder="Ex : Conakry, Kindia, Kankan…"
              value={form.localite}
              onChange={maj("localite")}
              required
            />
          </div>

          {/* Image */}
          <div>
            <label htmlFor="image">Photo (optionnel)</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
            />
            <p className="text-xs text-slate-400 mt-1">
              JPG ou PNG, 5 Mo max. Une belle photo augmente vos chances de vente.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="btn-secondaire flex-1"
              onClick={() => navigate(-1)}
            >
              Annuler
            </button>
            <button className="btn-primaire flex-1" type="submit">
              {modifier ? "Enregistrer les modifications" : "Publier l'annonce"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}