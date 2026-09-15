export default function Footer() {
  return (
    <footer className="footer">
      <div className="conteneur flex flex-col md:flex-row items-center justify-between gap-3">
        <p>
          🌍 <strong className="text-encre">TerreMerGn</strong> — Connecter les pêcheurs,
          éleveurs et agriculteurs de Guinée.
        </p>
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} · Fait avec ❤️ à Conakry
        </p>
      </div>
    </footer>
  );
}




// export default function Footer() {
//   return (
//     <footer className="footer">
//       <p>🌍 <strong>TerreMerGn</strong> — Connecter les pêcheurs, éleveurs et agriculteurs de Guinée.</p>
//     </footer>
//   );
// }
