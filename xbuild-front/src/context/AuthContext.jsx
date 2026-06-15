import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiFetch, getToken, setToken } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // true = session active, false = pas de session, null = vérification en cours
  const [isAuth,   setIsAuth]   = useState(null);
  const [user,     setUser]     = useState(null);

  // Vérifie le token stocké au démarrage
  useEffect(() => {
    const stored = getToken();
    if (!stored) {
      setIsAuth(false);
      return;
    }
    apiFetch("/api/auth/verify", { auth: true })
      .then(data => {
        setUser(data);
        setIsAuth(true);
      })
      .catch(() => {
        setToken(null);
        setUser(null);
        setIsAuth(false);
      });
  }, []);

  const login = useCallback(async (password) => {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    if (!data.token) throw new Error("Réponse invalide du serveur");
    setToken(data.token);
    setUser(data.user ?? { role: "admin" });
    setIsAuth(true);
    return data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsAuth(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuth,                      // null = en cours, true = connecté, false = non connecté
      checking: isAuth === null,   // true pendant la vérification initiale
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
