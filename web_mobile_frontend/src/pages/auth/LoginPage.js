import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../state/auth";

// PUBLIC_INTERFACE
export function LoginPage() {
  /** Login page for BikeTrack Pro. */
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("demo@biketrack.pro");
  const [password, setPassword] = useState("demo-password");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email.trim(), password);
      nav("/app");
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="authShell">
      <section className="authHero">
        <h1 className="h1">Track your bike in real time.</h1>
        <p className="muted">
          Live map tracking, geofencing alerts, and full location history—built for web & mobile.
        </p>

        <div className="card" style={{ marginTop: 18 }}>
          <div className="cardBody">
            <div className="h2">What you can do</div>
            <ul className="muted" style={{ margin: "10px 0 0", paddingLeft: 18 }}>
              <li>See last known location</li>
              <li>Watch live telemetry</li>
              <li>Draw geofences & get alerts</li>
              <li>Review trips and stops</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="authCard">
        <div className="authForm">
          <div className="card">
            <div className="cardHeader">
              <div>
                <div className="h2">Sign in</div>
                <div className="muted" style={{ fontSize: 12 }}>
                  Use your account to manage bikes and alerts.
                </div>
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
                  autoComplete="current-password"
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
                      <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
                        If the backend auth endpoints are not implemented yet, this is expected.
                      </div>
                    </div>
                  </div>
                ) : null}

                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button className="btn btnPrimary" disabled={busy} type="submit" style={{ flex: 1 }}>
                    {busy ? "Signing in…" : "Sign in"}
                  </button>
                </div>

                <div className="muted" style={{ marginTop: 12, fontSize: 13 }}>
                  New here? <Link to="/register" style={{ color: "var(--primary)" }}>Create an account</Link>
                </div>
              </form>
            </div>
          </div>

          <div className="muted" style={{ marginTop: 12, fontSize: 12 }}>
            Backend URL: {process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL}
          </div>
        </div>
      </section>
    </div>
  );
}
