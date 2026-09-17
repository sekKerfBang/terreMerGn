import { Routes, Route, Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Annonces from "./pages/Annonces";
import AnnonceDetail from "./pages/AnnonceDetail";
import AnnonceForm from "./pages/AnnonceForm";
import Messages from "./pages/Messages";
import AdminDashboard from "./pages/AdminDashboard";
import Paiement from "./pages/Paiement";
import Profil from "./pages/Profil";
import MotDePasseOublie from "./pages/MotDePasseOublie";
import ReinitialiserMotDePasse from "./pages/ReinitialiserMotDePasse";

function Page404() {
  return (
    <div className="conteneur">
      <div className="carte p-16 text-center max-w-lg mx-auto my-10">
        <p className="text-6xl mb-4">🧭</p>
        <h2>Page introuvable</h2>
        <p className="text-slate-500 mt-2 mb-6">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <Link to="/" className="btn-primaire">
          <Compass size={16} /> Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="app flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="conteneur flex-1 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
          <Route path="/reset-password/:uid/:token" element={<ReinitialiserMotDePasse />} />

          <Route path="/annonces" element={<Annonces />} />
          <Route path="/annonces/:id" element={<AnnonceDetail />} />
          <Route path="/annonces/nouvelle" element={<ProtectedRoute><AnnonceForm /></ProtectedRoute>} />
          <Route path="/annonces/:id/modifier" element={<ProtectedRoute><AnnonceForm /></ProtectedRoute>} />

          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/messages/:userId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

          <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />

          <Route path="/paiement/:annonceId" element={<ProtectedRoute><Paiement /></ProtectedRoute>} />
          <Route path="/paiement/succes" element={
            <div className="conteneur">
              <div className="carte p-14 text-center max-w-lg mx-auto my-10 animate-pop">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-5">
                  <span className="text-4xl">✅</span>
                </div>
                <h2>Paiement réussi !</h2>
                <p className="text-slate-500 mt-3 mb-7">
                  Le vendeur a été notifié de votre commande. Contactez-le via la messagerie
                  pour organiser la livraison.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Link to="/messages" className="btn-secondaire">Voir mes messages</Link>
                  <Link to="/annonces" className="btn-primaire">Retour au marché</Link>
                </div>
              </div>
            </div>
          } />

          <Route path="/admin" element={<ProtectedRoute admin><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}






// import { Routes, Route, Link } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Annonces from "./pages/Annonces";
// import AnnonceDetail from "./pages/AnnonceDetail";
// import AnnonceForm from "./pages/AnnonceForm";
// import Messages from "./pages/Messages";
// import AdminDashboard from "./pages/AdminDashboard";
// import Paiement from "./pages/Paiement";

// export default function App() {
//   return (
//     <div className="app">
//       <Navbar />
//       <main className="conteneur">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           <Route path="/annonces" element={<Annonces />} />
//           <Route path="/annonces/:id" element={<AnnonceDetail />} />
//           <Route
//             path="/annonces/nouvelle"
//             element={<ProtectedRoute><AnnonceForm /></ProtectedRoute>}
//           />
//           <Route
//             path="/annonces/:id/modifier"
//             element={<ProtectedRoute><AnnonceForm /></ProtectedRoute>}
//           />

//           <Route
//             path="/messages"
//             element={<ProtectedRoute><Messages /></ProtectedRoute>}
//           />
//           <Route
//             path="/messages/:userId"
//             element={<ProtectedRoute><Messages /></ProtectedRoute>}
//           />

//           <Route
//             path="/paiement/:annonceId"
//             element={<ProtectedRoute><Paiement /></ProtectedRoute>}
//           />
//           <Route
//             path="/paiement/succes"
//             element={
//               <div className="conteneur">
//                 <div className="carte p-12 text-center max-w-lg mx-auto">
//                   <div className="text-6xl mb-4">✅</div>
//                   <h2>Paiement réussi !</h2>
//                   <p className="text-slate-500 mt-2">
//                     Le vendeur a été notifié. Contactez-le pour organiser la livraison.
//                   </p>
//                   <Link to="/annonces" className="btn-primaire mt-6 inline-flex">
//                     Retour au marché
//                   </Link>
//                 </div>
//               </div>
//             }
//           />

//           <Route
//             path="/admin"
//             element={<ProtectedRoute admin><AdminDashboard /></ProtectedRoute>}
//           />
//         </Routes>
//       </main>
//       <Footer />
//     </div>
//   );
// } 








// // import { Routes, Route } from "react-router-dom";
// // import Navbar from "./components/Navbar";
// // import Footer from "./components/Footer";
// // import ProtectedRoute from "./components/ProtectedRoute";
// // import Home from "./pages/Home";
// // import Login from "./pages/Login";
// // import Register from "./pages/Register";
// // import Annonces from "./pages/Annonces";
// // import AnnonceDetail from "./pages/AnnonceDetail";
// // import AnnonceForm from "./pages/AnnonceForm";
// // import Messages from "./pages/Messages";
// // import AdminDashboard from "./pages/AdminDashboard";
// // import Paiement from "./pages/Paiement";
// // import { Link } from "react-router-dom";

// // export default function App() {
// //   return (
// //     <div className="app">
// //       <Navbar />
// //       <main className="conteneur">
// //         <Routes>
// //           <Route path="/" element={<Home />} />
// //           <Route path="/login" element={<Login />} />
// //           <Route path="/register" element={<Register />} />
// //           <Route path="/annonces" element={<Annonces />} />
// //           <Route path="/annonces/:id" element={<AnnonceDetail />} />
// //           <Route path="/annonces/nouvelle" element={
// //             <ProtectedRoute><AnnonceForm /></ProtectedRoute>} />
// //           <Route path="/annonces/:id/modifier" element={
// //             <ProtectedRoute><AnnonceForm /></ProtectedRoute>} />
// //           <Route path="/messages" element={
// //             <ProtectedRoute><Messages /></ProtectedRoute>} />
// //           <Route path="/messages/:userId" element={
// //             <ProtectedRoute><Messages /></ProtectedRoute>} />
// //           <Route path="/admin" element={
// //             <ProtectedRoute admin><AdminDashboard /></ProtectedRoute>} />
// //         </Routes>
// //         <Route path="/paiement/:annonceId" element={<ProtectedRoute><Paiement /></ProtectedRoute>} />
// //         <Route path="/paiement/succes" element={
// //           <div className="conteneur">
// //             <div className="carte p-12 text-center max-w-lg mx-auto">
// //               <div className="text-6xl mb-4">✅</div>
// //               <h2>Paiement réussi !</h2>
// //               <p className="text-slate-500 mt-2">Le vendeur a été notifié. Contactez-le pour organiser la livraison.</p>
// //               <Link to="/annonces" className="btn-primaire mt-6 inline-flex">Retour au marché</Link>
// //             </div>
// //           </div>
// //         } />
// //       </main>
// //       <Footer />
// //     </div>
// //   );
// // }
