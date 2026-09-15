import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Fish, Beef, Wheat, ShieldCheck, Truck, Phone } from "lucide-react";
import api from "../api";
import AnnonceCard from "../components/AnnonceCard";

export default function Home() {
  const [recentes, setRecentes] = useState([]);

  useEffect(() => {
    api.get("/annonces/?ordering=-cree_le")
      .then((res) => setRecentes((res.data.results || res.data).slice(0, 8)));
  }, []);

  const SECTEURS = [
    { icon: Fish, titre: "Pêche", desc: "Poissons frais, fumés, crustacés…", color: "ocean" },
    { icon: Beef, titre: "Élevage", desc: "Volailles, bœufs, caprins, œufs…", color: "lagune" },
    { icon: Wheat, titre: "Agriculture", desc: "Riz, fonio, manioc, fruits, légumes…", color: "terre" },
  ];

  return (
    <div className="conteneur space-y-12">
      {/* HERO */}
      <section className="hero">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-sm border border-white/20">
            🇬🇳 100% Guinée · GNF
          </span>
          <h1 className="mt-4">La pêche, l'élevage et l'agriculture réunis en un seul marché.</h1>
          <p>
            TerreMerGn met en relation directe producteurs et acheteurs partout en Guinée.
            Publiez, discutez, vendez — sans intermédiaire.
          </p>
          <div className="hero-actions">
            <Link to="/annonces" className="btn-primaire bg-white text-ocean-900 hover:bg-ocean-50">
              Explorer les annonces <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn-secondaire bg-white/10 text-white border-white/30 hover:bg-white/20">
              Rejoindre la communauté
            </Link>
          </div>
        </div>
        <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-lagune-500/20 rounded-full blur-3xl" />
        <div className="absolute -top-20 right-40 w-72 h-72 bg-terre-500/20 rounded-full blur-3xl" />
      </section>

      {/* SECTEURS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SECTEURS.map(({ icon: Icon, titre, desc }) => (
          <div key={titre} className="carte-secteur">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-ocean-50 flex items-center justify-center">
              <Icon className="text-ocean-700" size={28} />
            </div>
            <h3>{titre}</h3>
            <p className="text-sm text-slate-500 mt-2">{desc}</p>
          </div>
        ))}
      </section>

      {/* POURQUOI */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { icon: ShieldCheck, t: "Producteurs vérifiés", d: "Chaque profil est modéré par notre équipe." },
          { icon: Truck, t: "Livraison locale", d: "Échangez directement avec le vendeur pour organiser la remise." },
          { icon: Phone, t: "Paiement Mobile Money", d: "Orange Money, MTN MoMo et virement bancaire bientôt disponibles." },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="carte p-5 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-lagune-50 flex items-center justify-center flex-shrink-0">
              <Icon className="text-lagune-700" size={20} />
            </div>
            <div>
              <h3 className="text-base">{t}</h3>
              <p className="text-sm text-slate-500 mt-1">{d}</p>
            </div>
          </div>
        ))}
      </section>

      {/* DERNIÈRES ANNONCES */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2>Dernières annonces</h2>
            <p className="text-slate-500 text-sm mt-1">Fraîchement publiées par la communauté</p>
          </div>
          <Link to="/annonces" className="btn-lien flex items-center gap-1">
            Tout voir <ArrowRight size={16} />
          </Link>
        </div>
        {recentes.length === 0 ? (
          <p className="centrer">Aucune annonce pour l'instant.</p>
        ) : (
          <div className="grille">
            {recentes.map((a) => <AnnonceCard key={a.id} annonce={a} />)}
          </div>
        )}
      </section>
    </div>
  );
}







// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../api";
// import AnnonceCard from "../components/AnnonceCard";

// export default function Home() {
//   const [recentes, setRecentes] = useState([]);

//   useEffect(() => {
//     api.get("/annonces/?ordering=-cree_le").then((res) => setRecentes(res.data.slice(0, 6)));
//   }, []);

//   return (
//     <div>
//       <section className="hero">
//         <h1>Terre & Mer de Guinée, connectées. 🌍</h1>
//         <p>La plateforme qui relie pêcheurs, éleveurs et agriculteurs aux acheteurs.</p>
//         <div className="hero-actions">
//           <Link to="/annonces" className="btn-primaire">Voir les annonces</Link>
//           <Link to="/register" className="btn-secondaire">Rejoindre la communauté</Link>
//         </div>
//       </section>

//       <section className="secteurs">
//         {[
//           ["🐟", "Pêche", "Poissons frais, fumés, crustacés…"],
//           ["🐄", "Élevage", "Volailles, bœufs, caprins, œufs…"],
//           ["🌾", "Agriculture", "Riz, fonio, manioc, fruits, légumes…"],
//         ].map(([emoji, titre, desc]) => (
//           <div key={titre} className="carte-secteur">
//             <span className="emoji">{emoji}</span>
//             <h3>{titre}</h3>
//             <p>{desc}</p>
//           </div>
//         ))}
//       </section>

//       <section>
//         <h2>Dernières annonces</h2>
//         <div className="grille">
//           {recentes.map((a) => <AnnonceCard key={a.id} annonce={a} />)}
//         </div>
//       </section>
//     </div>
//   );
// }
