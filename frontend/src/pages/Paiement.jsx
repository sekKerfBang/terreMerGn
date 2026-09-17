import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Smartphone, Building2, ShieldCheck, ArrowLeft, Check, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api";
import { formatPrix } from "../utils";

const OPERATEURS = [
  { value: "ORANGE_MONEY", label: "Orange Money", emoji: "🟠", type: "mobile", indicatif: "+224" },
  { value: "MTN_MOMO", label: "MTN Mobile Money", emoji: "🟡", type: "mobile", indicatif: "+224" },
  { value: "BANCAIRE", label: "Virement bancaire", emoji: "🏦", type: "bank" },
];

export default function Paiement() {
  const { annonceId } = useParams();
  const navigate = useNavigate();
  const [annonce, setAnnonce] = useState(null);
  const [operateur, setOperateur] = useState("ORANGE_MONEY");
  const [telephone, setTelephone] = useState("");
  const [quantite, setQuantite] = useState(1);
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    api.get(`/annonces/${annonceId}/`).then((res) => setAnnonce(res.data))
      .catch(() => navigate("/annonces"));
  }, [annonceId, navigate]);

  if (!annonce) {
    return <div className="conteneur py-24 flex justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-ocean-100 border-t-ocean-600 animate-spin" />
    </div>;
  }

  const op = OPERATEURS.find((o) => o.value === operateur);
  const total = Number(annonce.prix) * quantite;
  const telValide = op.type === "bank" || /^[0-9+\s]{9,}$/.test(telephone.trim());

  const payer = async () => {
    setChargement(true);
    try {
      const { data } = await api.post(`/paiements/initier/${annonceId}/`, {
        operateur,
        telephone_client: telephone,
        quantite,
        return_url: `${window.location.origin}/paiement/succes`,
      });
      if (data.url_paiement) {
        window.location.href = data.url_paiement;
      } else {
        toast.success("Paiement initié. Suivez les instructions sur votre téléphone.");
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Erreur lors du paiement. Réessayez.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="conteneur max-w-2xl">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 -ml-2">
        <ArrowLeft size={16} /> Retour
      </button>

      {/* Indicateur d'étapes */}
      <div className="flex items-center justify-center gap-0 mb-8">
        {["Commande", "Paiement"].map((t, i) => (
          <div key={t} className="flex items-center">
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${i === 0 ? "bg-ocean-600 text-white" : "bg-ocean-700 text-white ring-4 ring-ocean-100"}`}>
                {i === 0 ? <Check size={15} /> : i + 1}
              </span>
              <span className={`text-sm font-semibold ${i === 1 ? "text-encre" : "text-slate-400"}`}>{t}</span>
            </div>
            {i === 0 && <div className="w-16 md:w-24 h-0.5 mx-3 bg-ocean-500" />}
          </div>
        ))}
      </div>

      {/* Récapitulatif */}
      <div className="carte p-6 mb-5 animate-fade-up">
        <div className="flex gap-4 items-center">
          {annonce.image ? (
            <img src={annonce.image} className="w-20 h-20 rounded-xl object-cover" alt="" />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-ocean-50 flex items-center justify-center text-3xl">🌍</div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-base truncate">{annonce.titre}</h3>
            <p className="text-sm text-slate-500">
              {formatPrix(annonce.prix)} / {annonce.unite}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <label className="!mb-0 text-sm">Quantité :</label>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setQuantite(Math.max(1, quantite - 1))}
              className="w-8 h-8 rounded-lg border border-slate-200 font-bold hover:bg-slate-50">−</button>
            <input type="number" min={1} max={annonce.quantite} value={quantite}
              onChange={(e) => setQuantite(Math.max(1, Math.min(annonce.quantite, Number(e.target.value))))}
              className="!w-20 text-center" />
            <button type="button" onClick={() => setQuantite(Math.min(annonce.quantite, quantite + 1))}
              className="w-8 h-8 rounded-lg border border-slate-200 font-bold hover:bg-slate-50">+</button>
            <span className="text-xs text-slate-400">max : {annonce.quantite}</span>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-slate-100 flex justify-between items-center">
          <span className="font-semibold text-slate-500">Total à payer</span>
          <span className="text-2xl font-extrabold text-ocean-800">{formatPrix(total)}</span>
        </div>
      </div>

      {/* Mode de paiement */}
      <div className="carte p-6 mb-5 animate-fade-up">
        <h3 className="text-base mb-4 flex items-center gap-2">
          <CreditCard size={18} className="text-ocean-700" /> Mode de paiement
        </h3>
        <div className="space-y-2.5">
          {OPERATEURS.map((o) => (
            <button key={o.value} onClick={() => setOperateur(o.value)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left
                ${operateur === o.value ? "border-ocean-600 bg-ocean-50 shadow-soft" : "border-slate-200 hover:border-slate-300"}`}>
              <span className="text-2xl">{o.emoji}</span>
              <span className="flex-1 font-semibold text-sm">{o.label}</span>
              {o.type === "mobile"
                ? <Smartphone size={16} className="text-slate-400" />
                : <Building2 size={16} className="text-slate-400" />}
            </button>
          ))}
        </div>

        {op.type === "mobile" && (
          <div className="mt-5 animate-fade-in">
            <label>Numéro {op.label} ({op.indicatif})</label>
            <input type="tel" placeholder="6XX XX XX XX" value={telephone}
              onChange={(e) => setTelephone(e.target.value)} />
            {telephone && !telValide && (
              <p className="text-xs text-red-500 mt-1">Numéro invalide (9 chiffres min.)</p>
            )}
          </div>
        )}

        {op.type === "bank" && (
          <p className="mt-4 text-sm text-slate-500 bg-slate-50 rounded-xl p-3.5">
            Vous serez redirigé vers notre passerelle sécurisée pour effectuer le virement bancaire.
          </p>
        )}
      </div>

      <button onClick={payer} disabled={chargement || !telValide}
        className="btn-primaire w-full !py-3.5 !text-base">
        <ShieldCheck size={18} />
        {chargement ? "Traitement sécurisé…" : `Payer ${formatPrix(total)}`}
      </button>

      <p className="text-xs text-slate-400 text-center mt-3 flex items-center justify-center gap-1.5">
        <ShieldCheck size={12} /> Paiement sécurisé · Le vendeur n'est payé qu'après votre confirmation
      </p>
    </div>
  );
}







// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Smartphone, Building2, ShieldCheck, ArrowLeft } from "lucide-react";
// import toast from "react-hot-toast";
// import api from "../api";

// const OPERATEURS = [
//   { value: "ORANGE_MONEY", label: "Orange Money", emoji: "🟠", type: "mobile", indicatif: "+224" },
//   { value: "MTN_MOMO",     label: "MTN Mobile Money", emoji: "🟡", type: "mobile", indicatif: "+224" },
//   { value: "BANCAIRE",     label: "Virement bancaire", emoji: "🏦", type: "bank" },
// ];

// export default function Paiement() {
//   const { annonceId } = useParams();
//   const navigate = useNavigate();
//   const [annonce, setAnnonce] = useState(null);
//   const [operateur, setOperateur] = useState("ORANGE_MONEY");
//   const [telephone, setTelephone] = useState("");
//   const [quantite, setQuantite] = useState(1);
//   const [chargement, setChargement] = useState(false);

//   useEffect(() => {
//     api.get(`/annonces/${annonceId}/`).then((res) => setAnnonce(res.data));
//   }, [annonceId]);

//   if (!annonce) return <div className="conteneur centrer">Chargement…</div>;

//   const op = OPERATEURS.find((o) => o.value === operateur);
//   const total = Number(annonce.prix) * quantite;

//   const payer = async () => {
//     setChargement(true);
//     try {
//       const { data } = await api.post(`/paiements/initier/${annonceId}/`, {
//         operateur,
//         telephone_client: telephone,
//         quantite,
//         return_url: `${window.location.origin}/paiement/succes`,
//       });
//       if (data.url_paiement) {
//         window.location.href = data.url_paiement;
//       } else {
//         toast.success("Paiement initié. Suivez les instructions.");
//         navigate("/");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.detail || "Erreur de paiement");
//     } finally {
//       setChargement(false);
//     }
//   };

//   return (
//     <div className="conteneur max-w-2xl">
//       <button onClick={() => navigate(-1)} className="btn-ghost mb-4 -ml-2">
//         <ArrowLeft size={16} /> Retour
//       </button>

//       <h1 className="mb-6">Finaliser la commande</h1>

//       <div className="carte p-6 mb-5">
//         <div className="flex gap-4 items-center">
//           {annonce.image ? (
//             <img src={annonce.image} className="w-20 h-20 rounded-xl object-cover" alt="" />
//           ) : (
//             <div className="w-20 h-20 rounded-xl bg-ocean-50 flex items-center justify-center text-3xl">🌍</div>
//           )}
//           <div className="flex-1">
//             <h3 className="text-base">{annonce.titre}</h3>
//             <p className="text-sm text-slate-500">
//               {Number(annonce.prix).toLocaleString("fr-FR")} GNF / {annonce.unite}
//             </p>
//           </div>
//         </div>

//         <div className="mt-5 flex items-center gap-3">
//           <label className="!mb-0 text-sm">Quantité :</label>
//           <input type="number" min={1} max={annonce.quantite} value={quantite}
//                  onChange={(e) => setQuantite(Math.max(1, Math.min(annonce.quantite, Number(e.target.value))))}
//                  className="w-24" />
//         </div>

//         <div className="mt-5 pt-5 border-t border-slate-100 flex justify-between items-center">
//           <span className="font-semibold">Total à payer</span>
//           <span className="text-2xl font-extrabold text-ocean-800">
//             {total.toLocaleString("fr-FR")} GNF
//           </span>
//         </div>
//       </div>

//       <div className="carte p-6 mb-5">
//         <h3 className="text-base mb-4">Mode de paiement</h3>
//         <div className="space-y-2">
//           {OPERATEURS.map((o) => (
//             <button
//               key={o.value}
//               onClick={() => setOperateur(o.value)}
//               className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
//                 operateur === o.value
//                   ? "border-ocean-600 bg-ocean-50 shadow-soft"
//                   : "border-slate-200 hover:border-slate-300"
//               }`}
//             >
//               <span className="text-2xl">{o.emoji}</span>
//               <span className="flex-1 font-semibold text-sm">{o.label}</span>
//               {o.type === "mobile" ? <Smartphone size={16} className="text-slate-400" /> : <Building2 size={16} className="text-slate-400" />}
//             </button>
//           ))}
//         </div>

//         {op.type === "mobile" && (
//           <div className="mt-5">
//             <label>Numéro {op.label} ({op.indicatif})</label>
//             <input
//               type="tel"
//               placeholder="6XX XX XX XX"
//               value={telephone}
//               onChange={(e) => setTelephone(e.target.value)}
//             />
//           </div>
//         )}

//         {op.type === "bank" && (
//           <p className="mt-4 text-sm text-slate-500 bg-slate-50 rounded-xl p-3">
//             Vous serez redirigé vers notre passerelle sécurisée pour effectuer le virement bancaire.
//           </p>
//         )}
//       </div>

//       <button onClick={payer} disabled={chargement} className="btn-primaire w-full py-3.5 text-base">
//         <ShieldCheck size={18} />
//         {chargement ? "Traitement…" : `Payer ${total.toLocaleString("fr-FR")} GNF`}
//       </button>

//       <p className="text-xs text-slate-400 text-center mt-3 flex items-center justify-center gap-1">
//         <ShieldCheck size={12} /> Paiement sécurisé via passerelle agréée
//       </p>
//     </div>
//   );
// }