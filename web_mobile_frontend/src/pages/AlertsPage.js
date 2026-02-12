import React, { useMemo, useState } from "react";
import { useStore } from "../state/store";

// PUBLIC_INTERFACE
export function AlertsPage() {
  /** Alerts UI showing geofence and device notifications. */
  const { alerts } = useStore();
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return alerts;
    return alerts.filter((a) => a.severity === filter);
  }, [alerts, filter]);

  return (
    <div className="card">
      <div className="cardHeader">
        <div>
          <div className="h2">Alerts</div>
          <div className="muted" style={{ fontSize: 12 }}>
            Notifications for geofence breaches and device events.
          </div>
        </div>
        <div style={{ width: 200 }}>
          <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Alert filter">
            <option value="all">All</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="cardBody">
        {filtered.length === 0 ? (
          <div className="muted">No alerts to show.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {filtered.map((a) => (
              <div
                key={a.id}
                className="card"
                style={{
                  boxShadow: "none",
                  background:
                    a.severity === "warning"
                      ? "rgba(245, 158, 11, 0.10)"
                      : a.severity === "critical"
                        ? "rgba(239, 68, 68, 0.10)"
                        : "rgba(59, 130, 246, 0.08)",
                }}
              >
                <div className="cardBody" style={{ padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontWeight: 800 }}>{a.title}</div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {new Date(a.ts).toLocaleString()}
                    </div>
                  </div>
                  <div className="muted" style={{ marginTop: 6 }}>
                    {a.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
