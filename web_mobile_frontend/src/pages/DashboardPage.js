import React, { useMemo } from "react";
import { BikeMap } from "../components/map/BikeMap";
import { useStore } from "../state/store";

// PUBLIC_INTERFACE
export function DashboardPage() {
  /** Dashboard overview: map + KPIs + recent alerts. */
  const { bikes, alerts, geofences, history } = useStore();

  const latestPoint = useMemo(() => {
    const pt = history[0];
    if (!pt) return null;
    return { ...pt, label: "Last known location" };
  }, [history]);

  const mapPoints = latestPoint ? [latestPoint] : [];

  const onlineCount = bikes.filter((b) => b.status === "online").length;

  return (
    <div className="grid2">
      <div style={{ display: "grid", gap: 16 }}>
        <div className="kpiRow">
          <div className="kpi">
            <div className="kpiTitle">Bikes</div>
            <div className="kpiValue">{bikes.length}</div>
          </div>
          <div className="kpi">
            <div className="kpiTitle">Online</div>
            <div className="kpiValue">{onlineCount}</div>
          </div>
          <div className="kpi">
            <div className="kpiTitle">Active geofences</div>
            <div className="kpiValue">{geofences.length}</div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div>
              <div className="h2">Map</div>
              <div className="muted" style={{ fontSize: 12 }}>
                Last known location + geofences
              </div>
            </div>
            <span className="badge">OSM / Leaflet</span>
          </div>
          <div className="cardBody" style={{ padding: 0 }}>
            <BikeMap points={mapPoints} geofences={geofences} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        <div className="card">
          <div className="cardHeader">
            <div>
              <div className="h2">Recent alerts</div>
              <div className="muted" style={{ fontSize: 12 }}>
                Latest geo-fence and device events
              </div>
            </div>
          </div>
          <div className="cardBody">
            {alerts.length === 0 ? (
              <div className="muted">No alerts yet.</div>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {alerts.slice(0, 6).map((a) => (
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
                      borderColor: "rgba(17,24,39,0.10)",
                    }}
                  >
                    <div className="cardBody" style={{ padding: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <div style={{ fontWeight: 700 }}>{a.title}</div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          {new Date(a.ts).toLocaleString()}
                        </div>
                      </div>
                      <div className="muted" style={{ marginTop: 6, fontSize: 13 }}>
                        {a.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div>
              <div className="h2">System</div>
              <div className="muted" style={{ fontSize: 12 }}>
                Backend integration status
              </div>
            </div>
          </div>
          <div className="cardBody">
            <div className="muted" style={{ fontSize: 13 }}>
              The downloaded OpenAPI spec currently exposes only <code>/</code>. UI is fully implemented with demo data
              and is ready to wire to backend endpoints as they appear.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
