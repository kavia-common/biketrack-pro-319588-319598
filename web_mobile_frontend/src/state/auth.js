import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/client";

const AuthContext = createContext(null);

const LS_KEY = "biketrackpro.session";

/**
 * Our backend OpenAPI currently only exposes "/" in the downloaded spec.
 * The UI still provides full auth flows; these calls are written to be compatible
 * with common FastAPI auth patterns, and will show a helpful error if endpoints
 * aren't implemented yet.
 */
async function tryAuthRequest(kind, payload) {
  const candidates =
    kind === "login"
      ? ["/auth/login", "/login", "/token"]
      : ["/auth/register", "/register", "/auth/signup"];

  let last = null;
  for (const path of candidates) {
    // token endpoint often expects form-encoded; we use JSON first; backend can adapt.
    // If it 404s we try next.
    // eslint-disable-next-line no-await-in-loop
    const res = await apiRequest(path, { method: "POST", body: payload });
    last = res;
    if (res.ok) return res;
    if (res.status !== 404) return res;
  }
  return last || { ok: false, status: 0, data: { message: "No auth endpoints found." } };
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides session/token to the app and implements login/logout/register helpers. */
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try {
        setSession(JSON.parse(raw));
      } catch {
        localStorage.removeItem(LS_KEY);
      }
    }
    setLoading(false);
  }, []);

  const value = useMemo(() => {
    const token = session?.token || null;

    return {
      session,
      token,
      loading,
      // PUBLIC_INTERFACE
      async login(email, password) {
        /** Logs the user in and stores token. */
        const res = await tryAuthRequest("login", { email, password });
        if (!res.ok) {
          const msg =
            res?.data?.detail ||
            res?.data?.message ||
            `Login failed (status ${res.status}).`;
          throw new Error(msg);
        }

        // Try common response shapes
        const tok = res.data?.access_token || res.data?.token || res.data?.jwt;
        const user = res.data?.user || { email };

        if (!tok) throw new Error("Login succeeded but no token was returned.");

        const newSession = { token: tok, user };
        localStorage.setItem(LS_KEY, JSON.stringify(newSession));
        setSession(newSession);
        return newSession;
      },
      // PUBLIC_INTERFACE
      async register(email, password) {
        /** Registers a new user. */
        const res = await tryAuthRequest("register", { email, password });
        if (!res.ok) {
          const msg =
            res?.data?.detail ||
            res?.data?.message ||
            `Registration failed (status ${res.status}).`;
          throw new Error(msg);
        }
        return res.data;
      },
      // PUBLIC_INTERFACE
      logout() {
        /** Clears current session. */
        localStorage.removeItem(LS_KEY);
        setSession(null);
      },
    };
  }, [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth context. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
