import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="conteneur py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display font-extrabold text-xl text-white">
            <span className="text-2xl">🌍</span>
            Terre<span className="text-lagune-400">Mer</span>Gn
          </div>
          <p className="text-sm text-white/60 mt-3 max-w-sm leading-relaxed">
            La première place de marché digitale dédiée aux pêcheurs, éleveurs
            et agriculteurs de Guinée. Zéro intermédiaire, 100% local.
          </p>
          <div className="flex flex-col gap-2 mt-5 text-sm text-white/70">
            <span className="flex items-center gap-2"><MapPin size={14} className="text-lagune-400" /> Conakry, Guinée</span>
            <a href="mailto:contact@terremergn.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={14} className="text-lagune-400" /> contact@terremergn.com
            </a>
            <a href="tel:+224620000000" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={14} className="text-lagune-400" /> +224 620 00 00 00
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-wide mb-4">Navigation</h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li><Link to="/annonces" className="hover:text-lagune-300 transition-colors">Marché</Link></li>
            <li><Link to="/register" className="hover:text-lagune-300 transition-colors">Créer un compte</Link></li>
            <li><Link to="/annonces/nouvelle" className="hover:text-lagune-300 transition-colors">Publier une annonce</Link></li>
            <li><Link to="/login" className="hover:text-lagune-300 transition-colors">Connexion</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-wide mb-4">Secteurs</h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li>🐟 Pêche — poissons & crustacés</li>
            <li>🐄 Élevage — volailles & bétail</li>
            <li>🌾 Agriculture — céréales & maraîchage</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="conteneur py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} TerreMerGn — Tous droits réservés.</p>
          <p>Fait avec ❤️ à Conakry 🇬🇳</p>
        </div>
      </div>
    </footer>
  );
}








// export default function Footer() {
//   return (
//     <footer className="footer">
//       <div className="conteneur flex flex-col md:flex-row items-center justify-between gap-3">
//         <p>
//           🌍 <strong className="text-encre">TerreMerGn</strong> — Connecter les pêcheurs,
//           éleveurs et agriculteurs de Guinée.
//         </p>
//         <p className="text-xs text-slate-400">
//           © {new Date().getFullYear()} · Fait avec ❤️ à Conakry
//         </p>
//       </div>
//     </footer>
//   );
// }




// // export default function Footer() {
// //   return (
// //     <footer className="footer">
// //       <p>🌍 <strong>TerreMerGn</strong> — Connecter les pêcheurs, éleveurs et agriculteurs de Guinée.</p>
// //     </footer>
// //   );
// // }
