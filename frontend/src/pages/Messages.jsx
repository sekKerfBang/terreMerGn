import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, MessageSquare } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Messages() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [fil, setFil] = useState([]);
  const [texte, setTexte] = useState("");
  const basRef = useRef(null);

  const chargerConversations = () =>
    api.get("/messages/conversations/").then((res) => setConversations(res.data));

  useEffect(() => { chargerConversations(); }, []);

  useEffect(() => {
    if (!userId) return;
    api.get(`/messages/fil/${userId}/`).then((res) => {
      setFil(res.data);
      chargerConversations();
    });
  }, [userId]);

  useEffect(() => {
    basRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [fil]);

  const envoyer = async (e) => {
    e.preventDefault();
    if (!texte.trim()) return;
    await api.post("/messages/envoyer/", { destinataire: Number(userId), contenu: texte });
    setTexte("");
    const res = await api.get(`/messages/fil/${userId}/`);
    setFil(res.data);
    chargerConversations();
  };

  return (
    <div className="conteneur">
      <h1 className="mb-4">Messages</h1>
      <div className="messagerie">
        <aside className="liste-conversations">
          <h3>Conversations</h3>
          {conversations.length === 0 && (
            <p className="text-sm text-slate-400 px-2 py-4 text-center">Aucune conversation.</p>
          )}
          {conversations.map((c) => (
            <button
              key={c.partenaire.id}
              className={`conversation ${Number(userId) === c.partenaire.id ? "active" : ""}`}
              onClick={() => navigate(`/messages/${c.partenaire.id}`)}
            >
              <strong>{c.partenaire.first_name || c.partenaire.username}</strong>
              <span className="role-mini">{c.partenaire.role}</span>
              {c.non_lus > 0 && <span className="badge-non-lus">{c.non_lus}</span>}
              <small>{c.dernier_message?.contenu?.slice(0, 40)}…</small>
            </button>
          ))}
        </aside>

        <section className="fil-messages">
          {!userId ? (
            <div className="flex-1 flex items-center justify-center flex-col text-slate-400 gap-3">
              <MessageSquare size={40} />
              <p>Choisissez une conversation</p>
            </div>
          ) : (
            <>
              <div className="messages-scroll">
                {fil.map((m) => (
                  <div key={m.id} className={`bulle ${m.expediteur.id === user.id ? "moi" : "lui"}`}>
                    <p>{m.contenu}</p>
                    <small>{new Date(m.envoye_le).toLocaleString("fr-FR")}</small>
                  </div>
                ))}
                <div ref={basRef}></div>
              </div>
              <form onSubmit={envoyer} className="form-message">
                <input
                  placeholder="Écrire un message…"
                  value={texte}
                  onChange={(e) => setTexte(e.target.value)}
                />
                <button className="btn-primaire" type="submit">
                  <Send size={16} />
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
// import api from "../api";
// import { useAuth } from "../context/AuthContext";

// export default function Messages() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [conversations, setConversations] = useState([]);
//   const [fil, setFil] = useState([]);
//   const [partenaire, setPartenaire] = useState(null);
//   const [texte, setTexte] = useState("");
//   const basRef = useRef(null);

//   const chargerConversations = () =>
//     api.get("/messages/conversations/").then((res) => setConversations(res.data));

//   useEffect(() => { chargerConversations(); }, []);

//   useEffect(() => {
//     if (!userId) return;
//     api.get(`/messages/fil/${userId}/`).then((res) => {
//       setFil(res.data);
//       setPartenaire(res.data[0]
//         ? (res.data[0].expediteur.id === user.id
//             ? { id: userId }
//             : res.data[0].expediteur)
//         : { id: userId });
//       chargerConversations();
//     });
//   }, [userId]);

//   useEffect(() => {
//     basRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [fil]);

//   const envoyer = async (e) => {
//     e.preventDefault();
//     if (!texte.trim()) return;
//     await api.post("/messages/envoyer/", {
//       destinataire: Number(userId), contenu: texte,
//     });
//     setTexte("");
//     const res = await api.get(`/messages/fil/${userId}/`);
//     setFil(res.data);
//     chargerConversations();
//   };

//   return (
//     <div className="messagerie">
//       <aside className="liste-conversations">
//         <h3>Conversations</h3>
//         {conversations.length === 0 && <p>Aucune conversation.</p>}
//         {conversations.map((c) => (
//           <button key={c.partenaire.id}
//             className={`conversation ${Number(userId) === c.partenaire.id ? "active" : ""}`}
//             onClick={() => navigate(`/messages/${c.partenaire.id}`)}>
//             <strong>{c.partenaire.first_name || c.partenaire.username}</strong>
//             <span className="role-mini">{c.partenaire.role}</span>
//             {c.non_lus > 0 && <span className="badge-non-lus">{c.non_lus}</span>}
//             <small>{c.dernier_message?.contenu?.slice(0, 40)}…</small>
//           </button>
//         ))}
//       </aside>

//       <section className="fil-messages">
//         {!userId ? (
//           <p className="centrer">Choisissez une conversation.</p>
//         ) : (
//           <>
//             <div className="messages-scroll">
//               {fil.map((m) => (
//                 <div key={m.id}
//                   className={`bulle ${m.expediteur.id === user.id ? "moi" : "lui"}`}>
//                   <p>{m.contenu}</p>
//                   <small>{new Date(m.envoye_le).toLocaleString("fr-FR")}</small>
//                 </div>
//               ))}
//               <div ref={basRef}></div>
//             </div>
//             <form onSubmit={envoyer} className="form-message">
//               <input placeholder="Écrire un message…" value={texte}
//                 onChange={(e) => setTexte(e.target.value)} />
//               <button className="btn-primaire" type="submit">Envoyer</button>
//             </form>
//           </>
//         )}
//       </section>
//     </div>
//   );
// }
