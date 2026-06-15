import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth() {
  const { isAuth, checking } = useAuth();
  const location = useLocation();

  // En cours de vérification — ne rien décider
  if (checking) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "#0b0d10", gap: 16,
      }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{
          width: 36, height: 36,
          border: "3px solid rgba(245,91,31,0.2)",
          borderTopColor: "var(--color-primary)",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }} />
        <span style={{ color:"#555", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
          Chargement…
        </span>
      </div>
    );
  }

  // Non authentifié → page de connexion
  if (!isAuth) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Authentifié → afficher le contenu protégé
  return <Outlet />;
}
