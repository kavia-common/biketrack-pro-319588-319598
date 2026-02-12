import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../state/auth";

// PUBLIC_INTERFACE
export function RegisterPage() {
  /** Registration page for BikeTrack Pro. */
  const { register } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setOkMsg("");
    setBusy(true);
    try {
      await register(email.trim(), password);
      setOkMsg("Account created. You can now sign in.");
      setTimeout(() => nav("/login"), 700);
    } catch (err) {
      setError(err?.message || "Registration failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="authShell">
      <section className="authHero">
        <h1 className="h1">Secure by design.</h1>
        <p className="muted">
          Create an account to associate bikes, geofences, alerts, and history with your profile.
        </p>
      </section>

      <section className="authCard">
        <div className="authForm">
          <div className="card">
            <div className="cardHeader">
              <div>
                <div className="h2">Create account</div>
                <div className="muted" style={{ fontSize: 12 }}>Email + password sign up.</div>
              </div>
            </div>

            <div className="cardBody">
              <form onSubmit={onSubmit}>
                <label className="label" htmlFor="email">
                  Email
                </label>
                <input
                  className="input"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />

                <label className="label" htmlFor="password">
                  Password
                </label>
                <input
                  className="input"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />

                {error ? (
                  <div
                    className="card"
                    style={{
                      marginTop: 12,
                      borderColor: "rgba(239,68,68,0.25)",
                      background: "rgba(239,68,68,0.06)",
                      boxShadow: "none",
                    }}
                  >
                    <div className="cardBody" style={{ padding: 12, color: "#991b1b" }}>
                      {error}
                    </div>
                  </div>
                ) : null}

                {okMsg ? (
                  <div
                    className="card"
                    style={{
                      marginTop: 12,
                      borderColor: "rgba(16,185,129,0.25)",
                      background: "rgba(16,185,129,0.06)",
                      boxShadow: "none",
                    }}
                  >
                    <div className="cardBody" style={{ padding: 12, color: "#065f46" }}>
                      {okMsg}
                    </div>
                  </div>
                ) : null}

                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button className="btn btnPrimary" disabled={busy} type="submit" style={{ flex: 1 }}>
                    {busy ? "Creating…" : "Create account"}
                  </button>
                </div>

                <div className="muted" style={{ marginTop: 12, fontSize: 13 }}>
                  Already have an account?{" "}
                  <Link to="/login" style={{ color: "var(--primary)" }}>
                    Sign in
                  </Link>
                </div>
              </form>
            </div>
          </div>

          <div className="muted" style={{ marginTop: 12, fontSize: 12 }}>
            Note: If register endpoints are not implemented on the backend yet, this may fail.
          </div>
        </div>
      </section>
    </div>
  );
}
