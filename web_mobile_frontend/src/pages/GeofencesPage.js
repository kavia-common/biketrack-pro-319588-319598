import React, { useMemo, useState } from "react";
import { BikeMap } from "../components/map/BikeMap";
import { useStore } from "../state/store";

// PUBLIC_INTERFACE
export function GeofencesPage() {
  /** Geofence management UI (circle fences). */
  const { geofences, addGeofence, removeGeofence, addAlert } = useStore();

  const [name, setName] = useState("New fence");
  const [lat, setLat] = useState("37.7749");
  const [lng, setLng] = useState("-122.4194");
  const [radiusM, setRadiusM] = useState("250");

  const parsed = useMemo(() => {
    const clat = Number(lat);
    const clng = Number(lng);
    const r = Number(radiusM);
    return {
      ok: Number.isFinite(clat) && Number.isFinite(clng) && Number.isFinite(r) && r > 10,
      center: { lat: clat, lng: clng },
      radiusM: r,
    };
  }, [lat, lng, radiusM]);

  return (
    <div className="grid2">
      <div className="card">
        <div className="cardHeader">
          <div>
            <div className="h2">Geofences</div>
            <div className="muted" style={{ fontSize: 12 }}>
              Create zones and get alerted when a bike leaves them.
            </div>
          </div>
        </div>
        <div className="cardBody" style={{ padding: 0 }}>
          <BikeMap
            center={parsed.ok ? parsed.center : undefined}
            points={parsed.ok ? [{ id: "center", ...parsed.center, label: "Fence center" }] : []}
            geofences={[
              ...geofences,
              ...(parsed.ok
                ? [{ id: "draft", name: `${name} (draft)`, center: parsed.center, radiusM: parsed.radiusM }]
                : []),
            ]}
          />
        </div>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        <div className="card">
          <div className="cardHeader">
            <div>
              <div className="h2">Create geofence</div>
              <div className="muted" style={{ fontSize: 12 }}>
                Circle fence defined by center coordinates + radius.
              </div>
            </div>
          </div>

          <div className="cardBody">
            <label className="label" htmlFor="name">Name</label>
            <input className="input" id="name" value={name} onChange={(e) => setName(e.target.value)} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label className="label" htmlFor="lat">Latitude</label>
                <input className="input" id="lat" value={lat} onChange={(e) => setLat(e.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="lng">Longitude</label>
                <input className="input" id="lng" value={lng} onChange={(e) => setLng(e.target.value)} />
              </div>
            </div>

            <label className="label" htmlFor="radius">Radius (meters)</label>
            <input className="input" id="radius" value={radiusM} onChange={(e) => setRadiusM(e.target.value)} />

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button
                className="btn btnPrimary"
                disabled={!parsed.ok}
                onClick={() => {
                  const gf = {
                    id: `gf_${Date.now()}`,
                    name: name.trim() || "Geofence",
                    center: parsed.center,
                    radiusM: parsed.radiusM,
                  };
                  addGeofence(gf);
                  addAlert({
                    ts: new Date().toISOString(),
                    severity: "info",
                    title: "Geofence created",
                    detail: `Created '${gf.name}' (${gf.radiusM}m).`,
                  });
                }}
              >
                Save geofence
              </button>
            </div>

            {!parsed.ok ? (
              <div className="muted" style={{ marginTop: 10, fontSize: 12 }}>
                Enter valid lat/lng and a radius &gt; 10m.
              </div>
            ) : null}
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div>
              <div className="h2">Existing</div>
              <div className="muted" style={{ fontSize: 12 }}>
                {geofences.length} geofence(s)
              </div>
            </div>
          </div>
          <div className="cardBody">
            {geofences.length === 0 ? (
              <div className="muted">No geofences yet.</div>
            ) : (
              <table className="table" aria-label="Geofences table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Radius</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {geofences.map((g) => (
                    <tr key={g.id}>
                      <td style={{ fontWeight: 700 }}>{g.name}</td>
                      <td className="muted">{g.radiusM}m</td>
                      <td>
                        <div className="rowActions">
                          <button className="btn btnDanger" onClick={() => removeGeofence(g.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
