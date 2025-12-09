import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// Backend base URL
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load session");
        const data = await res.json();
        setUser(data.user || null);
      } catch (err) {
        console.error("Auth /me error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, []);

  function loginWithSpotify() {
    window.location.href = `${API_BASE}/auth/spotify/login`;
  }

  async function logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  }

  const value = { user, loading, loginWithSpotify, logout };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
