import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, admin = false }) {
  const { user, chargement } = useAuth();
  if (chargement) return <p className="centrer">Chargement…</p>;
  if (!user) return <Navigate to="/login" />;
  if (admin && !user.is_staff) return <Navigate to="/" />;
  return children;
}
