import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="conteneur">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/annonces" element={<Annonces />} />
          <Route path="/annonces/:id" element={<AnnonceDetail />} />
          <Route
            path="/annonces/nouvelle"
            element={<ProtectedRoute><AnnonceForm /></ProtectedRoute>}
          />
          <Route
            path="/annonces/:id/modifier"
            element={<ProtectedRoute><AnnonceForm /></ProtectedRoute>}
          />

          <Route
            path="/messages"
            element={<ProtectedRoute><Messages /></ProtectedRoute>}
          />
          <Route
            path="/messages/:userId"
            element={<ProtectedRoute><Messages /></ProtectedRoute>}
          />

          <Route
            path="/paiement/:annonceId"
            element={<ProtectedRoute><Paiement /></ProtectedRoute>}
          />
          <Route
            path="/paiement/succes"
            element={
              <div className="conteneur">
                <div className="carte p-12 text-center max-w-lg mx-auto">
                  <div className="text-6xl mb-4">✅</div>
                  <h2>Paiement réussi !</h2>
                  <p className="text-slate-500 mt-2">
                    Le vendeur a été notifié. Contactez-le pour organiser la livraison.
                  </p>
                  <Link to="/annonces" className="btn-primaire mt-6 inline-flex">
                    Retour au marché
                  </Link>
                </div>
              </div>
            }
          />

          <Route
            path="/admin"
            element={<ProtectedRoute admin><AdminDashboard /></ProtectedRoute>}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
} 








// import { Routes, Route } from "react-router-dom";
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
// import { Link } from "react-router-dom";

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
//           <Route path="/annonces/nouvelle" element={
//             <ProtectedRoute><AnnonceForm /></ProtectedRoute>} />
//           <Route path="/annonces/:id/modifier" element={
//             <ProtectedRoute><AnnonceForm /></ProtectedRoute>} />
//           <Route path="/messages" element={
//             <ProtectedRoute><Messages /></ProtectedRoute>} />
//           <Route path="/messages/:userId" element={
//             <ProtectedRoute><Messages /></ProtectedRoute>} />
//           <Route path="/admin" element={
//             <ProtectedRoute admin><AdminDashboard /></ProtectedRoute>} />
//         </Routes>
//         <Route path="/paiement/:annonceId" element={<ProtectedRoute><Paiement /></ProtectedRoute>} />
//         <Route path="/paiement/succes" element={
//           <div className="conteneur">
//             <div className="carte p-12 text-center max-w-lg mx-auto">
//               <div className="text-6xl mb-4">✅</div>
//               <h2>Paiement réussi !</h2>
//               <p className="text-slate-500 mt-2">Le vendeur a été notifié. Contactez-le pour organiser la livraison.</p>
//               <Link to="/annonces" className="btn-primaire mt-6 inline-flex">Retour au marché</Link>
//             </div>
//           </div>
//         } />
//       </main>
//       <Footer />
//     </div>
//   );
// }
