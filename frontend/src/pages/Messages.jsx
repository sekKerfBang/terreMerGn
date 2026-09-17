import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, MessageSquare, ArrowLeft, Circle } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { tempsRelatif } from "../utils";

export default function Messages() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [fil, setFil] = useState([]);
  const [texte, setTexte] = useState("");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const basRef = useRef(null);
  const intervalRef = useRef(null);

  const chargerConversations = useCallback(
    () => api.get("/messages/conversations/").then((res) => setConversations(res.data)),
    []
  );

  const chargerFil = useCallback(() => {
    if (!userId) return Promise.resolve();
    return api.get(`/messages/fil/${userId}/`).then((res) => setFil(res.data));
  }, [userId]);

  // Chargement initial + polling toutes les 5 s
  useEffect(() => {
    chargerConversations();
    chargerFil();
    intervalRef.current = setInterval(() => {
      chargerConversations();
      chargerFil();
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [chargerConversations, chargerFil]);

  useEffect(() => {
    basRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [fil]);

  const envoyer = async (e) => {
    e.preventDefault();
    if (!texte.trim() || envoiEnCours) return;
    setEnvoiEnCours(true);
    try {
      await api.post("/messages/envoyer/", { destinataire: Number(userId), contenu: texte });
      setTexte("");
      await Promise.all([chargerFil(), chargerConversations()]);
    } finally {
      setEnvoiEnCours(false);
    }
  };

  const partenaire = conversations.find((c) => c.partenaire.id === Number(userId))?.partenaire;

  return (
    <div>
      <h1 className="mb-4">Messages</h1>
      <div className={`messagerie ${userId ? "avec-fil" : "sans-fil"}`}>
        {/* ===== Liste des conversations ===== */}
        <aside className="liste-conversations">
          <h3 className="px-2 pt-1 pb-3 text-sm">Conversations</h3>
          {conversations.length === 0 && (
            <div className="text-center py-10 text-slate-300">
              <MessageSquare size={36} className="mx-auto mb-3" />
              <p className="text-sm">Aucune conversation.</p>
              <p className="text-xs mt-1">Contactez un vendeur depuis une annonce.</p>
            </div>
          )}
          {conversations.map((c) => (
            <button key={c.partenaire.id}
              className={`conversation ${Number(userId) === c.partenaire.id ? "active" : ""}`}
              onClick={() => navigate(`/messages/${c.partenaire.id}`)}>
              <div className="flex items-center gap-2.5 w-full">
                <span className="w-10 h-10 rounded-full bg-ocean-100 text-ocean-800 flex items-center justify-center
                                 font-bold text-sm flex-shrink-0">
                  {(c.partenaire.first_name?.[0] || c.partenaire.username?.[0] || "?").toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm truncate">
                      {c.partenaire.first_name || c.partenaire.username}
                    </strong>
                    {c.dernier_message && (
                      <small className="!text-[10px] flex-shrink-0">
                        {tempsRelatif(c.dernier_message.envoye_le)}
                      </small>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <small className="flex-1">{c.dernier_message?.contenu || "—"}</small>
                    {c.non_lus > 0 && <span className="badge-non-lus !static">{c.non_lus}</span>}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </aside>

        {/* ===== Fil de discussion ===== */}
        <section className="fil-messages">
          {!userId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-3">
              <MessageSquare size={44} />
              <p className="font-medium">Choisissez une conversation</p>
              <p className="text-sm">Vos échanges avec les vendeurs et acheteurs apparaîtront ici.</p>
            </div>
          ) : (
            <>
              {/* En-tête du fil */}
              <div className="entete-fil">
                <button onClick={() => navigate("/messages")} className="btn-ghost !p-1.5 -ml-1"
                  aria-label="Retour">
                  <ArrowLeft size={18} />
                </button>
                <span className="w-9 h-9 rounded-full bg-ocean-700 text-white flex items-center justify-center font-bold text-sm">
                  {(partenaire?.first_name?.[0] || partenaire?.username?.[0] || "?").toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">
                    {partenaire?.first_name || partenaire?.username || "Utilisateur"}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Circle size={7} className="text-emerald-500 fill-emerald-500" />
                    {partenaire?.role || "Membre"} · répond généralement vite
                  </div>
                </div>
              </div>

              <div className="messages-scroll">
                {fil.length === 0 && (
                  <p className="text-center text-slate-300 text-sm py-10">
                    Écrivez votre premier message 👋
                  </p>
                )}
                {fil.map((m) => (
                  <div key={m.id}
                    className={`bulle ${m.expediteur.id === user.id ? "moi" : "lui"} ${!m.lu && m.expediteur.id !== user.id ? "non-lu" : ""}`}>
                    <p className="whitespace-pre-line">{m.contenu}</p>
                    <small>{new Date(m.envoye_le).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</small>
                  </div>
                ))}
                <div ref={basRef}></div>
              </div>

              <form onSubmit={envoyer} className="form-message">
                <input placeholder="Écrire un message…" value={texte}
                  onChange={(e) => setTexte(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) envoyer(e); }} />
                <button className="btn-primaire !px-4" type="submit" disabled={envoiEnCours || !texte.trim()}>
                  {envoiEnCours
                    ? <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    : <Send size={17} />}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}








// import { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Send, MessageSquare } from "lucide-react";
// import api from "../api";
// import { useAuth } from "../context/AuthContext";

// export default function Messages() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [conversations, setConversations] = useState([]);
//   const [fil, setFil] = useState([]);
//   const [texte, setTexte] = useState("");
//   const basRef = useRef(null);

//   const chargerConversations = () =>
//     api.get("/messages/conversations/").then((res) => setConversations(res.data));

//   useEffect(() => { chargerConversations(); }, []);

//   useEffect(() => {
//     if (!userId) return;
//     api.get(`/messages/fil/${userId}/`).then((res) => {
//       setFil(res.data);
//       chargerConversations();
//     });
//   }, [userId]);

//   useEffect(() => {
//     basRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [fil]);

//   const envoyer = async (e) => {
//     e.preventDefault();
//     if (!texte.trim()) return;
//     await api.post("/messages/envoyer/", { destinataire: Number(userId), contenu: texte });
//     setTexte("");
//     const res = await api.get(`/messages/fil/${userId}/`);
//     setFil(res.data);
//     chargerConversations();
//   };

//   return (
//     <div className="conteneur">
//       <h1 className="mb-4">Messages</h1>
//       <div className="messagerie">
//         <aside className="liste-conversations">
//           <h3>Conversations</h3>
//           {conversations.length === 0 && (
//             <p className="text-sm text-slate-400 px-2 py-4 text-center">Aucune conversation.</p>
//           )}
//           {conversations.map((c) => (
//             <button
//               key={c.partenaire.id}
//               className={`conversation ${Number(userId) === c.partenaire.id ? "active" : ""}`}
//               onClick={() => navigate(`/messages/${c.partenaire.id}`)}
//             >
//               <strong>{c.partenaire.first_name || c.partenaire.username}</strong>
//               <span className="role-mini">{c.partenaire.role}</span>
//               {c.non_lus > 0 && <span className="badge-non-lus">{c.non_lus}</span>}
//               <small>{c.dernier_message?.contenu?.slice(0, 40)}…</small>
//             </button>
//           ))}
//         </aside>

//         <section className="fil-messages">
//           {!userId ? (
//             <div className="flex-1 flex items-center justify-center flex-col text-slate-400 gap-3">
//               <MessageSquare size={40} />
//               <p>Choisissez une conversation</p>
//             </div>
//           ) : (
//             <>
//               <div className="messages-scroll">
//                 {fil.map((m) => (
//                   <div key={m.id} className={`bulle ${m.expediteur.id === user.id ? "moi" : "lui"}`}>
//                     <p>{m.contenu}</p>
//                     <small>{new Date(m.envoye_le).toLocaleString("fr-FR")}</small>
//                   </div>
//                 ))}
//                 <div ref={basRef}></div>
//               </div>
//               <form onSubmit={envoyer} className="form-message">
//                 <input
//                   placeholder="Écrire un message…"
//                   value={texte}
//                   onChange={(e) => setTexte(e.target.value)}
//                 />
//                 <button className="btn-primaire" type="submit">
//                   <Send size={16} />
//                 </button>
//               </form>
//             </>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }






// // import { useEffect, useState, useRef } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import api from "../api";
// // import { useAuth } from "../context/AuthContext";

// // export default function Messages() {
// //   const { userId } = useParams();
// //   const navigate = useNavigate();
// //   const { user } = useAuth();
// //   const [conversations, setConversations] = useState([]);
// //   const [fil, setFil] = useState([]);
// //   const [partenaire, setPartenaire] = useState(null);
// //   const [texte, setTexte] = useState("");
// //   const basRef = useRef(null);

// //   const chargerConversations = () =>
// //     api.get("/messages/conversations/").then((res) => setConversations(res.data));

// //   useEffect(() => { chargerConversations(); }, []);

// //   useEffect(() => {
// //     if (!userId) return;
// //     api.get(`/messages/fil/${userId}/`).then((res) => {
// //       setFil(res.data);
// //       setPartenaire(res.data[0]
// //         ? (res.data[0].expediteur.id === user.id
// //             ? { id: userId }
// //             : res.data[0].expediteur)
// //         : { id: userId });
// //       chargerConversations();
// //     });
// //   }, [userId]);

// //   useEffect(() => {
// //     basRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [fil]);

// //   const envoyer = async (e) => {
// //     e.preventDefault();
// //     if (!texte.trim()) return;
// //     await api.post("/messages/envoyer/", {
// //       destinataire: Number(userId), contenu: texte,
// //     });
// //     setTexte("");
// //     const res = await api.get(`/messages/fil/${userId}/`);
// //     setFil(res.data);
// //     chargerConversations();
// //   };

// //   return (
// //     <div className="messagerie">
// //       <aside className="liste-conversations">
// //         <h3>Conversations</h3>
// //         {conversations.length === 0 && <p>Aucune conversation.</p>}
// //         {conversations.map((c) => (
// //           <button key={c.partenaire.id}
// //             className={`conversation ${Number(userId) === c.partenaire.id ? "active" : ""}`}
// //             onClick={() => navigate(`/messages/${c.partenaire.id}`)}>
// //             <strong>{c.partenaire.first_name || c.partenaire.username}</strong>
// //             <span className="role-mini">{c.partenaire.role}</span>
// //             {c.non_lus > 0 && <span className="badge-non-lus">{c.non_lus}</span>}
// //             <small>{c.dernier_message?.contenu?.slice(0, 40)}…</small>
// //           </button>
// //         ))}
// //       </aside>

// //       <section className="fil-messages">
// //         {!userId ? (
// //           <p className="centrer">Choisissez une conversation.</p>
// //         ) : (
// //           <>
// //             <div className="messages-scroll">
// //               {fil.map((m) => (
// //                 <div key={m.id}
// //                   className={`bulle ${m.expediteur.id === user.id ? "moi" : "lui"}`}>
// //                   <p>{m.contenu}</p>
// //                   <small>{new Date(m.envoye_le).toLocaleString("fr-FR")}</small>
// //                 </div>
// //               ))}
// //               <div ref={basRef}></div>
// //             </div>
// //             <form onSubmit={envoyer} className="form-message">
// //               <input placeholder="Écrire un message…" value={texte}
// //                 onChange={(e) => setTexte(e.target.value)} />
// //               <button className="btn-primaire" type="submit">Envoyer</button>
// //             </form>
// //           </>
// //         )}
// //       </section>
// //     </div>
// //   );
// // }
