import React, { useMemo, useState } from "react";
import { BikeMap } from "../components/map/BikeMap";
import { useStore } from "../state/store";

// PUBLIC_INTERFACE
export function HistoryPage() {
  /** Location history UI: map polyline + table. */
  const { history, geofences, bikes } = useStore();
  const [bikeId, setBikeId] = useState("all");

  const filtered = useMemo(() => {
    const h = [...history].sort((a, b) => (a.ts < b.ts ? 1 : -1));
    if (bikeId === "all") return h;
    return h.filter((x) => x.bikeId === bikeId);
  }, [history, bikeId]);

  const pointsForMap = useMemo(() => {
    const asc = [...filtered].sort((a, b) => (a.ts > b.ts ? 1 : -1));
    return asc.map((p) => ({ ...p, label: `${new Date(p.ts).toLocaleTimeString()} • ${p.speedKmh ?? 0}km/h` }));
  }, [filtered]);

  return (
    <div className="grid2">
      <div className="card">
        <div className="cardHeader">
          <div>
            <div className="h2">History</div>
            <div className="muted" style={{ fontSize: 12 }}>
              Review location points and paths.
            </div>
          </div>
          <div style={{ width: 220 }}>
            <select className="select" value={bikeId} onChange={(e) => setBikeId(e.target.value)} aria-label="Bike filter">
              <option value="all">All bikes</option>
              {bikes.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="cardBody" style={{ padding: 0 }}>
          <BikeMap points={pointsForMap} geofences={geofences} />
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <div>
            <div className="h2">Points</div>
            <div className="muted" style={{ fontSize: 12 }}>
              {filtered.length} points
            </div>
          </div>
        </div>
        <div className="cardBody">
          <table className="table" aria-label="History points">
            <thead>
              <tr>
                <th>Time</th>
                <th>Lat</th>
                <th>Lng</th>
                <th>Speed</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 20).map((p) => (
                <tr key={p.id}>
                  <td>{new Date(p.ts).toLocaleString()}</td>
                  <td className="muted">{p.lat.toFixed(5)}</td>
                  <td className="muted">{p.lng.toFixed(5)}</td>
                  <td className="muted">{(p.speedKmh ?? 0).toFixed(1)} km/h</td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="muted">
                    No history yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
          <div className="muted" style={{ marginTop: 10, fontSize: 12 }}>
            Showing latest 20 points.
          </div>
        </div>
      </div>
    </div>
  );
}
