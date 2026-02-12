import React, { useState } from "react";
import { useStore } from "../state/store";

// PUBLIC_INTERFACE
export function BikesPage() {
  /** Bike management UI (add/remove, status, last seen). */
  const { bikes, addBike, removeBike } = useStore();
  const [name, setName] = useState("");

  return (
    <div className="card">
      <div className="cardHeader">
        <div>
          <div className="h2">Bikes</div>
          <div className="muted" style={{ fontSize: 12 }}>
            Manage the bikes linked to your account.
          </div>
        </div>
      </div>

      <div className="cardBody">
        <div className="card" style={{ boxShadow: "none" }}>
          <div className="cardBody">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 10 }}>
              <div>
                <label className="label" htmlFor="bikeName">
                  Bike name
                </label>
                <input
                  id="bikeName"
                  className="input"
                  placeholder="e.g. Trek Domane"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div style={{ alignSelf: "end" }}>
                <button
                  className="btn btnPrimary"
                  onClick={() => {
                    const n = name.trim();
                    if (!n) return;
                    addBike(n);
                    setName("");
                  }}
                  style={{ width: "100%" }}
                >
                  Add bike
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <table className="table" aria-label="Bikes table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Last seen</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bikes.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 700 }}>{b.name}</td>
                  <td>
                    <span className="badge">
                      <span
                        aria-hidden="true"
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 999,
                          background: b.status === "online" ? "var(--success)" : "var(--muted)",
                          display: "inline-block",
                        }}
                      />
                      {b.status}
                    </span>
                  </td>
                  <td className="muted">{b.lastSeen}</td>
                  <td>
                    <div className="rowActions">
                      <button className="btn btnDanger" onClick={() => removeBike(b.id)}>
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {bikes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="muted">
                    No bikes yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
