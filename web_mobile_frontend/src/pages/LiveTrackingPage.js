import React, { useEffect, useMemo, useRef, useState } from "react";
import { BikeMap } from "../components/map/BikeMap";
import { createTelemetrySocket } from "../api/ws";
import { useAuth } from "../state/auth";
import { useStore } from "../state/store";

function jitter(pt) {
  const d = 0.0008;
  return { lat: pt.lat + (Math.random() - 0.5) * d, lng: pt.lng + (Math.random() - 0.5) * d };
}

// PUBLIC_INTERFACE
export function LiveTrackingPage() {
  /** Live tracking UI (WS stream if available; demo simulation otherwise). */
  const { token } = useAuth();
  const { geofences } = useStore();

  const [connected, setConnected] = useState(false);
  const [err, setErr] = useState("");
  const [points, setPoints] = useState([
    { id: "live_1", lat: 37.7749, lng: -122.4194, label: "Live" },
  ]);

  const wsRef = useRef(null);
  const simRef = useRef(null);

  const canWs = useMemo(() => !!process.env.REACT_APP_WS_URL, []);

  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (simRef.current) clearInterval(simRef.current);
    };
  }, []);

  function startSimulation() {
    if (simRef.current) return;
    simRef.current = setInterval(() => {
      setPoints((prev) => {
        const next = jitter(prev[0]);
        return [{ ...prev[0], ...next, label: "Live (simulated)" }];
      });
    }, 1200);
  }

  function stopSimulation() {
    if (simRef.current) clearInterval(simRef.current);
    simRef.current = null;
  }

  function connect() {
    setErr("");
    if (!canWs) {
      // No WS configured, simulate.
      setConnected(true);
      startSimulation();
      return;
    }
    try {
      const ws = createTelemetrySocket({ token });
      wsRef.current = ws;
      ws.onopen = () => setConnected(true);
      ws.onclose = () => setConnected(false);
      ws.onerror = () => setErr("WebSocket error.");
      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          // Accept common telemetry shapes: {lat,lng} or {location:{lat,lng}}
          const lat = msg.lat ?? msg.location?.lat;
          const lng = msg.lng ?? msg.location?.lng;
          if (typeof lat === "number" && typeof lng === "number") {
            setPoints([{ id: "live_1", lat, lng, label: "Live" }]);
          }
        } catch {
          // ignore non-json
        }
      };
    } catch (e) {
      setErr(e?.message || "Failed to connect.");
    }
  }

  function disconnect() {
    stopSimulation();
    if (wsRef.current) wsRef.current.close();
    wsRef.current = null;
    setConnected(false);
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <div className="cardHeader">
          <div>
            <div className="h2">Live tracking</div>
            <div className="muted" style={{ fontSize: 12 }}>
              Stream bike position updates in real time.
            </div>
          </div>
          <span className="badge">{connected ? "Connected" : "Disconnected"}</span>
        </div>

        <div className="cardBody" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button className="btn btnPrimary" onClick={connect} disabled={connected}>
            Connect
          </button>
          <button className="btn" onClick={disconnect} disabled={!connected}>
            Disconnect
          </button>
          <span className="muted" style={{ fontSize: 13 }}>
            {canWs ? `WS: ${process.env.REACT_APP_WS_URL}` : "WS not configured; using simulation."}
          </span>
        </div>

        {err ? (
          <div className="cardBody" style={{ paddingTop: 0 }}>
            <div style={{ color: "#991b1b", fontWeight: 600 }}>{err}</div>
          </div>
        ) : null}

        <div className="cardBody" style={{ padding: 0 }}>
          <BikeMap points={points} geofences={geofences} />
        </div>
      </div>
    </div>
  );
}
