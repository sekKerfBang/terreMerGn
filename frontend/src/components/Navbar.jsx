import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu, X, LogOut, Plus, MessageSquare, Shield, User as UserIcon, ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [ouvert, setOuvert] = useState(false);
  const [menuCompte, setMenuCompte] = useState(false);
  const refCompte = useRef(null);

  useEffect(() => {
    const fermer = (e) => {
      if (refCompte.current && !refCompte.current.contains(e.target)) setMenuCompte(false);
    };
    document.addEventListener("click", fermer);
    return () => document.removeEventListener("click", fermer);
  }, []);

  const deconnecter = () => {
    logout();
    setOuvert(false);
    setMenuCompte(false);
    navigate("/");
  };

  const classesLien = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
      isActive ? "text-ocean-700 bg-ocean-50" : "text-slate-600 hover:text-ocean-800 hover:bg-slate-50"
    }`;

  const LienMobile = ({ to, children }) => (
    <NavLink to={to} onClick={() => setOuvert(false)} className={classesLien}>
      {children}
    </NavLink>
  );

  const avatarUtilisateur = (classe = "w-8 h-8") => (
    <span className={`${classe} rounded-full bg-ocean-700 text-white flex items-center justify-center text-sm font-bold overflow-hidden shrink-0`}>
      {user?.avatar ? (
        <img src={user.avatar} alt="Photo de profil" className="w-full h-full object-cover" />
      ) : (
        (user?.first_name?.[0] || user?.username?.[0] || "?").toUpperCase()
      )}
    </span>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-100">
      <nav className="conteneur flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-xl text-encre">
          <span className="text-2xl">🌍</span>
          Terre<span className="text-lagune-600">Mer</span>Gn
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/annonces" className={classesLien}>Annonces</NavLink>
          {user && (
            <NavLink to="/messages" className={classesLien}>
              <MessageSquare size={15} className="inline mr-1 -mt-0.5" />Messages
            </NavLink>
          )}
          {user?.is_staff && (
            <NavLink to="/admin" className={classesLien}>
              <Shield size={15} className="inline mr-1 -mt-0.5" />Admin
            </NavLink>
          )}
          {user && (
            <Link to="/annonces/nouvelle" className="btn-primaire !py-2 ml-2">
              <Plus size={16} /> Publier
            </Link>
          )}

          {user ? (
            <div className="relative ml-3" ref={refCompte}>
              <button
                onClick={() => setMenuCompte(!menuCompte)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-slate-200 hover:border-ocean-300 transition-colors"
              >
                {avatarUtilisateur()}
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {menuCompte && (
                <div className="absolute right-0 mt-2 w-60 carte p-2 animate-slide-in">
                  <div className="px-3 py-2.5 border-b border-slate-100">
                    <div className="font-bold text-sm">{user.first_name || user.username}</div>
                    <div className="text-xs text-slate-400">{user.role_display}</div>
                  </div>
                  <NavLink to="/profil" onClick={() => setMenuCompte(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 mt-1">
                    <UserIcon size={15} /> Mon profil
                  </NavLink>
                  <NavLink to="/messages" onClick={() => setMenuCompte(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 mt-1">
                    <MessageSquare size={15} /> Messages
                  </NavLink>
                  {user.is_staff && (
                    <NavLink to="/admin" onClick={() => setMenuCompte(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                      <Shield size={15} /> Administration
                    </NavLink>
                  )}
                  <button onClick={deconnecter}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 mt-1">
                    <LogOut size={15} /> Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-3">
              <NavLink to="/login" className={classesLien}>Connexion</NavLink>
              <Link to="/register" className="btn-primaire !py-2">S'inscrire</Link>
            </div>
          )}
        </div>

        {/* Mobile */}
        <button onClick={() => setOuvert(!ouvert)} className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          aria-label="Menu">
          {ouvert ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {ouvert && (
        <div className="md:hidden border-t border-slate-100 bg-white animate-slide-in">
          <div className="conteneur py-3 flex flex-col gap-1">
            <LienMobile to="/annonces">Annonces</LienMobile>
            {user && <LienMobile to="/messages">Messages</LienMobile>}
            {user?.is_staff && <LienMobile to="/admin">Admin</LienMobile>}
            {user ? (
              <>
                <Link to="/annonces/nouvelle" className="btn-primaire my-2" onClick={() => setOuvert(false)}>
                  <Plus size={16} /> Publier une annonce
                </Link>
                <div className="flex items-center gap-3 px-3 py-2 border-t border-slate-100 mt-1">
                  {avatarUtilisateur("w-9 h-9")}
                  <div className="flex-1">
                    <div className="text-sm font-bold">{user.first_name || user.username}</div>
                    <div className="text-xs text-slate-500">{user.role_display}</div>
                  </div>
                  <button onClick={deconnecter} className="btn-ghost !text-red-600">
                    <LogOut size={16} /> Sortir
                  </button>
                </div>
                <LienMobile to="/profil">Mon profil</LienMobile>
              </>
            ) : (
              <div className="flex gap-2 mt-2">
                <Link to="/login" className="btn-secondaire flex-1" onClick={() => setOuvert(false)}>Connexion</Link>
                <Link to="/register" className="btn-primaire flex-1" onClick={() => setOuvert(false)}>S'inscrire</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}









// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Menu, X, LogOut, Plus, MessageSquare, Shield, User as UserIcon } from "lucide-react";
// import { useAuth } from "../context/AuthContext";

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [ouvert, setOuvert] = useState(false);

//   const deconnecter = () => {
//     logout();
//     navigate("/");
//     setOuvert(false);
//   };

//   const Lien = ({ to, children, onClick }) => (
//     <Link
//       to={to}
//       onClick={() => { onClick?.(); setOuvert(false); }}
//       className="text-slate-700 hover:text-ocean-800 font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
//     >
//       {children}
//     </Link>
//   );

//   return (
//     <nav className="navbar">
//       <div className="conteneur flex items-center justify-between h-16">
//         <Link to="/" className="logo">
//           <span className="text-2xl">🌍</span>
//           <span>Terre<span className="text-lagune-600">Mer</span>Gn</span>
//         </Link>

//         {/* Desktop */}
//         <div className="hidden md:flex nav-liens">
//           <Lien to="/annonces">Annonces</Lien>
//           {user && <Lien to="/messages"><MessageSquare size={16} className="inline mr-1" />Messages</Lien>}
//           {user?.is_staff && <Lien to="/admin"><Shield size={16} className="inline mr-1" />Admin</Lien>}
//           {user && (
//             <Link to="/annonces/nouvelle" className="btn-primaire text-sm">
//               <Plus size={16} /> Publier
//             </Link>
//           )}
//           {user ? (
//             <div className="flex items-center gap-3 ml-2 pl-3 border-l border-slate-200">
//               <div className="text-right leading-tight">
//                 <div className="text-sm font-semibold text-encre">
//                   {user.first_name || user.username}
//                 </div>
//                 <div className="text-xs text-slate-500">{user.role_display}</div>
//               </div>
//               <button
//                 onClick={deconnecter}
//                 title="Déconnexion"
//                 className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
//               >
//                 <LogOut size={18} />
//               </button>
//             </div>
//           ) : (
//             <>
//               <Lien to="/login">Connexion</Lien>
//               <Link to="/register" className="btn-primaire text-sm">S'inscrire</Link>
//             </>
//           )}
//         </div>

//         {/* Mobile toggle */}
//         <button
//           onClick={() => setOuvert(!ouvert)}
//           className="md:hidden p-2 rounded-lg hover:bg-slate-100"
//           aria-label="Menu"
//         >
//           {ouvert ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Mobile menu */}
//       {ouvert && (
//         <div className="md:hidden border-t border-slate-100 bg-white animate-slide-in">
//           <div className="conteneur py-3 flex flex-col gap-1">
//             <Lien to="/annonces">Annonces</Lien>
//             {user && <Lien to="/messages">Messages</Lien>}
//             {user?.is_staff && <Lien to="/admin">Admin</Lien>}
//             {user ? (
//               <>
//                 <Link to="/annonces/nouvelle" className="btn-primaire my-2" onClick={() => setOuvert(false)}>
//                   <Plus size={16} /> Publier une annonce
//                 </Link>
//                 <div className="flex items-center gap-3 px-3 py-2 border-t border-slate-100 mt-2">
//                   <UserIcon size={18} className="text-slate-400" />
//                   <div className="flex-1">
//                     <div className="text-sm font-semibold">{user.first_name || user.username}</div>
//                     <div className="text-xs text-slate-500">{user.role_display}</div>
//                   </div>
//                   <button onClick={deconnecter} className="btn-ghost text-red-600">
//                     <LogOut size={16} /> Sortir
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <div className="flex gap-2 mt-2">
//                 <Link to="/login" className="btn-secondaire flex-1" onClick={() => setOuvert(false)}>Connexion</Link>
//                 <Link to="/register" className="btn-primaire flex-1" onClick={() => setOuvert(false)}>S'inscrire</Link>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }






// // import { Link, useNavigate } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";

// // export default function Navbar() {
// //   const { user, logout } = useAuth();
// //   const navigate = useNavigate();

// //   return (
// //     <nav className="navbar">
// //       <Link to="/" className="logo">🌍 TerreMerGn</Link>
// //       <div className="nav-liens">
// //         <Link to="/annonces">Annonces</Link>
// //         {user && <Link to="/messages">Messages</Link>}
// //         {user && <Link to="/annonces/nouvelle" className="btn-primaire">+ Publier</Link>}
// //         {user?.is_staff && <Link to="/admin">Admin</Link>}
// //         {user ? (
// //           <>
// //             <span className="badge-role">{user.role_display || user.role}</span>
// //             <button onClick={() => { logout(); navigate("/"); }} className="btn-lien">
// //               Déconnexion
// //             </button>
// //           </>
// //         ) : (
// //           <>
// //             <Link to="/login">Connexion</Link>
// //             <Link to="/register" className="btn-primaire">S'inscrire</Link>
// //           </>
// //         )}
// //       </div>
// //     </nav>
// //   );
// // }
