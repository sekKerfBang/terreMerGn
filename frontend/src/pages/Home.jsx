import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Fish, Beef, Wheat, ShieldCheck, Truck, Smartphone,
  TrendingUp, MapPin, Users, Megaphone,
} from "lucide-react";
import api from "../api";
import AnnonceCard from "../components/AnnonceCard";

const SECTEURS = [
  { key: "PECHE", icon: Fish, titre: "Pêche", desc: "Poissons frais, fumés, crustacés…", emoji: "🐟" },
  { key: "ELEVAGE", icon: Beef, titre: "Élevage", desc: "Volailles, bœufs, caprins, œufs…", emoji: "🐄" },
  { key: "AGRICULTURE", icon: Wheat, titre: "Agriculture", desc: "Riz, fonio, manioc, fruits, légumes…", emoji: "🌾" },
];

const ETAPES = [
  { n: "1", t: "Créez votre compte", d: "Choisissez votre rôle : pêcheur, éleveur, agriculteur ou acheteur." },
  { n: "2", t: "Publiez ou parcourez", d: "Mettez vos produits en vente en 2 minutes ou trouvez le fournisseur idéal." },
  { n: "3", t: "Négociez & vendez", d: "Discutez directement par message, payez en toute sécurité, organisez la remise." },
];

export default function Home() {
  const [recentes, setRecentes] = useState([]);
  const [stats, setStats] = useState({ annonces: 0, localites: 0 });

  useEffect(() => {
    api.get("/annonces/?ordering=-cree_le")
      .then((res) => {
        const data = res.data.results || res.data;
        setRecentes(data.slice(0, 8));
        setStats((s) => ({ ...s, annonces: data.length }));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-16 md:space-y-24">
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="relative z-10 animate-fade-up">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-sm border border-white/20">
            🇬🇳 100% Guinée · Prix en GNF
          </span>
          <h1 className="mt-5">
            La pêche, l'élevage et l'agriculture<br className="hidden md:block" />
            réunis en un seul marché.
          </h1>
          <p>
            TerreMerGn met en relation directe producteurs et acheteurs partout en Guinée.
            Publiez, discutez, vendez — sans intermédiaire.
          </p>
          <div className="hero-actions">
            <Link to="/annonces"
              className="inline-flex items-center gap-2 bg-white text-ocean-900 font-bold px-6 py-3.5 rounded-xl hover:bg-ocean-50 transition-all hover:shadow-lift active:scale-[0.98]">
              Explorer les annonces <ArrowRight size={18} />
            </Link>
            <Link to="/register"
              className="inline-flex items-center gap-2 bg-white/10 text-white font-bold px-6 py-3.5 rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all active:scale-[0.98]">
              Rejoindre la communauté
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mt-10 text-sm text-white/70">
            <span className="flex items-center gap-2"><TrendingUp size={16} className="text-lagune-300" /> {stats.annonces}+ annonces</span>
            <span className="flex items-center gap-2"><MapPin size={16} className="text-lagune-300" /> Toutes les régions</span>
            <span className="flex items-center gap-2"><Users size={16} className="text-lagune-300" /> 4 types d'acteurs</span>
          </div>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-lagune-500/20 rounded-full blur-3xl" />
        <div className="absolute -top-24 right-40 w-72 h-72 bg-terre-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -left-16 w-64 h-64 bg-ocean-400/20 rounded-full blur-3xl" />
      </section>

      {/* ===== SECTEURS ===== */}
      <section>
        <div className="text-center mb-8">
          <h2>Trois filières, une seule plateforme</h2>
          <p className="text-slate-500 mt-2">Cliquez sur un secteur pour explorer ses annonces</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SECTEURS.map(({ key, icon: Icon, titre, desc, emoji }) => (
            <Link key={key} to={`/annonces?secteur=${key}`} className="carte-secteur group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-ocean-50 flex items-center justify-center
                              transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Icon className="text-ocean-700" size={30} />
              </div>
              <h3>{emoji} {titre}</h3>
              <p className="text-sm text-slate-500 mt-2">{desc}</p>
              <span className="inline-flex items-center gap-1 text-ocean-700 text-sm font-bold mt-4
                               opacity-0 group-hover:opacity-100 transition-opacity">
                Explorer <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== COMMENT ÇA MARCHE ===== */}
      <section className="carte p-8 md:p-12">
        <div className="text-center mb-10">
          <h2>Comment ça marche ?</h2>
          <p className="text-slate-500 mt-2">Simple comme bonjour, en 3 étapes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ETAPES.map(({ n, t, d }) => (
            <div key={n} className="relative text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-ocean-700 text-white font-display font-extrabold
                              flex items-center justify-center text-lg shadow-lift">
                {n}
              </div>
              <h3 className="text-lg mt-4">{t}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== GARANTIES ===== */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { icon: ShieldCheck, t: "Producteurs vérifiés", d: "Chaque profil est modéré par notre équipe pour des échanges sûrs." },
          { icon: Truck, t: "Livraison locale", d: "Contactez directement le vendeur pour organiser la remise près de chez vous." },
          { icon: Smartphone, t: "Mobile Money", d: "Orange Money, MTN MoMo — payez sans vous déplacer." },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="carte p-6 flex gap-4 items-start">
            <div className="w-11 h-11 rounded-xl bg-lagune-50 flex items-center justify-center flex-shrink-0">
              <Icon className="text-lagune-700" size={20} />
            </div>
            <div>
              <h3 className="text-base">{t}</h3>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">{d}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ===== DERNIERES ANNONCES ===== */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2>Dernières annonces</h2>
            <p className="text-slate-500 text-sm mt-1">Fraîchement publiées par la communauté</p>
          </div>
          <Link to="/annonces" className="btn-ghost">
            Tout voir <ArrowRight size={16} />
          </Link>
        </div>
        {recentes.length === 0 ? (
          <div className="carte p-14 text-center">
            <p className="text-5xl mb-4">📭</p>
            <h3 className="text-slate-600">Aucune annonce pour l'instant</h3>
            <p className="text-slate-400 text-sm mt-2 mb-6">Soyez le premier à publier sur le marché !</p>
            <Link to="/annonces/nouvelle" className="btn-primaire">
              <Megaphone size={16} /> Publier une annonce
            </Link>
          </div>
        ) : (
          <div className="grille">
            {recentes.map((a) => <AnnonceCard key={a.id} annonce={a} />)}
          </div>
        )}
      </section>

      {/* ===== CTA ===== */}
      <section className="hero !py-14">
        <div className="relative z-10">
          <h2 className="!text-2xl md:!text-3xl">Vous avez des produits à vendre ?</h2>
          <p className="!mt-3">Rejoignez des centaines de producteurs guinéens sur TerreMerGn.</p>
          <div className="hero-actions !mt-6">
            <Link to="/register"
              className="inline-flex items-center gap-2 bg-lagune-400 text-ocean-900 font-bold px-6 py-3.5 rounded-xl hover:bg-lagune-300 transition-all active:scale-[0.98]">
              Créer mon compte gratuit <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}






// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { ArrowRight, Fish, Beef, Wheat, ShieldCheck, Truck, Phone } from "lucide-react";
// import api from "../api";
// import AnnonceCard from "../components/AnnonceCard";

// export default function Home() {
//   const [recentes, setRecentes] = useState([]);

//   useEffect(() => {
//     api.get("/annonces/?ordering=-cree_le")
//       .then((res) => setRecentes((res.data.results || res.data).slice(0, 8)));
//   }, []);

//   const SECTEURS = [
//     { icon: Fish, titre: "Pêche", desc: "Poissons frais, fumés, crustacés…", color: "ocean" },
//     { icon: Beef, titre: "Élevage", desc: "Volailles, bœufs, caprins, œufs…", color: "lagune" },
//     { icon: Wheat, titre: "Agriculture", desc: "Riz, fonio, manioc, fruits, légumes…", color: "terre" },
//   ];

//   return (
//     <div className="conteneur space-y-12">
//       {/* HERO */}
//       <section className="hero">
//         <div className="relative z-10">
//           <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-sm border border-white/20">
//             🇬🇳 100% Guinée · GNF
//           </span>
//           <h1 className="mt-4">La pêche, l'élevage et l'agriculture réunis en un seul marché.</h1>
//           <p>
//             TerreMerGn met en relation directe producteurs et acheteurs partout en Guinée.
//             Publiez, discutez, vendez — sans intermédiaire.
//           </p>
//           <div className="hero-actions">
//             <Link to="/annonces" className="btn-primaire bg-white text-ocean-900 hover:bg-ocean-50">
//               Explorer les annonces <ArrowRight size={18} />
//             </Link>
//             <Link to="/register" className="btn-secondaire bg-white/10 text-white border-white/30 hover:bg-white/20">
//               Rejoindre la communauté
//             </Link>
//           </div>
//         </div>
//         <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-lagune-500/20 rounded-full blur-3xl" />
//         <div className="absolute -top-20 right-40 w-72 h-72 bg-terre-500/20 rounded-full blur-3xl" />
//       </section>

//       {/* SECTEURS */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
//         {SECTEURS.map(({ icon: Icon, titre, desc }) => (
//           <div key={titre} className="carte-secteur">
//             <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-ocean-50 flex items-center justify-center">
//               <Icon className="text-ocean-700" size={28} />
//             </div>
//             <h3>{titre}</h3>
//             <p className="text-sm text-slate-500 mt-2">{desc}</p>
//           </div>
//         ))}
//       </section>

//       {/* POURQUOI */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
//         {[
//           { icon: ShieldCheck, t: "Producteurs vérifiés", d: "Chaque profil est modéré par notre équipe." },
//           { icon: Truck, t: "Livraison locale", d: "Échangez directement avec le vendeur pour organiser la remise." },
//           { icon: Phone, t: "Paiement Mobile Money", d: "Orange Money, MTN MoMo et virement bancaire bientôt disponibles." },
//         ].map(({ icon: Icon, t, d }) => (
//           <div key={t} className="carte p-5 flex gap-4 items-start">
//             <div className="w-10 h-10 rounded-xl bg-lagune-50 flex items-center justify-center flex-shrink-0">
//               <Icon className="text-lagune-700" size={20} />
//             </div>
//             <div>
//               <h3 className="text-base">{t}</h3>
//               <p className="text-sm text-slate-500 mt-1">{d}</p>
//             </div>
//           </div>
//         ))}
//       </section>

//       {/* DERNIÈRES ANNONCES */}
//       <section>
//         <div className="flex items-end justify-between mb-5">
//           <div>
//             <h2>Dernières annonces</h2>
//             <p className="text-slate-500 text-sm mt-1">Fraîchement publiées par la communauté</p>
//           </div>
//           <Link to="/annonces" className="btn-lien flex items-center gap-1">
//             Tout voir <ArrowRight size={16} />
//           </Link>
//         </div>
//         {recentes.length === 0 ? (
//           <p className="centrer">Aucune annonce pour l'instant.</p>
//         ) : (
//           <div className="grille">
//             {recentes.map((a) => <AnnonceCard key={a.id} annonce={a} />)}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }




