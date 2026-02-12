import React, { useState } from "react";
import { apiRequest, getApiBaseUrl } from "../api/client";
import { useAuth } from "../state/auth";

// PUBLIC_INTERFACE
export function SettingsPage() {
  /** Settings & diagnostics page. */
  const { token } = useAuth();
  const [health, setHealth] = useState(null);
  const [busy, setBusy] = useState(false);

  async function ping() {
    setBusy(true);
    try {
      const res = await apiRequest("/", { token });
      setHealth(res);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <div className="cardHeader">
          <div>
            <div className="h2">Settings</div>
            <div className="muted" style={{ fontSize: 12 }}>
              Diagnostics and configuration.
            </div>
          </div>
        </div>
        <div className="cardBody">
          <div className="muted" style={{ fontSize: 13 }}>
            API base: <strong>{getApiBaseUrl()}</strong>
          </div>
          <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
            WS URL: <strong>{process.env.REACT_APP_WS_URL || "(not set)"}</strong>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
            <button className="btn btnPrimary" onClick={ping} disabled={busy}>
              {busy ? "Pinging…" : "Ping backend /"}
            </button>
            {health ? (
              <span className="badge">
                {health.ok ? "OK" : "Error"} • {health.status}
              </span>
            ) : null}
          </div>

          {health ? (
            <pre
              className="card"
              style={{
                marginTop: 12,
                padding: 12,
                boxShadow: "none",
                overflow: "auto",
                maxHeight: 280,
              }}
            >
{JSON.stringify(health.data, null, 2)}
            </pre>
          ) : null}
        </div>
      </div>
    </div>
  );
}
