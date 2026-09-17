import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, admin = false }) {
  const { user, chargement } = useAuth();
  if (chargement) {
    return (
      <div className="conteneur py-24 flex justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-ocean-100 border-t-ocean-600 animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  if (admin && !user.is_staff) return <Navigate to="/" />;
  return children;
}






// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function ProtectedRoute({ children, admin = false }) {
//   const { user, chargement } = useAuth();
//   if (chargement) return <p className="centrer">Chargement…</p>;
//   if (!user) return <Navigate to="/login" />;
//   if (admin && !user.is_staff) return <Navigate to="/" />;
//   return children;
// }
