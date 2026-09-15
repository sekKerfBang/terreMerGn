import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      api.get("/auth/me/")
        .then((res) => setUser(res.data))
        .catch(() => localStorage.clear())
        .finally(() => setChargement(false));
    } else {
      setChargement(false);
    }
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post("/auth/token/", { username, password });
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    const me = await api.get("/auth/me/");
    setUser(me.data);
  };

  const register = async (donnees) => {
    await api.post("/auth/register/", donnees);
    return login(donnees.username, donnees.password);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, chargement }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
