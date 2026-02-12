import React, { createContext, useContext, useMemo, useState } from "react";

const StoreContext = createContext(null);

const demoBikes = [
  { id: "bike_1", name: "City Commuter", status: "online", lastSeen: "Just now" },
  { id: "bike_2", name: "Road Bike", status: "offline", lastSeen: "2h ago" },
];

const demoAlerts = [
  { id: "al_1", ts: new Date().toISOString(), severity: "warning", title: "Geofence breached", detail: "City Commuter left 'Home' zone." },
  { id: "al_2", ts: new Date(Date.now() - 3600 * 1000).toISOString(), severity: "info", title: "Battery update", detail: "Road Bike battery at 62%." },
];

const demoGeofences = [
  { id: "gf_1", name: "Home", center: { lat: 37.7749, lng: -122.4194 }, radiusM: 350 },
];

const demoHistory = [
  { id: "pt_1", ts: new Date(Date.now() - 12 * 60 * 1000).toISOString(), lat: 37.7752, lng: -122.4186, bikeId: "bike_1", speedKmh: 14.2 },
  { id: "pt_2", ts: new Date(Date.now() - 10 * 60 * 1000).toISOString(), lat: 37.7756, lng: -122.4178, bikeId: "bike_1", speedKmh: 9.8 },
  { id: "pt_3", ts: new Date(Date.now() - 5 * 60 * 1000).toISOString(), lat: 37.7761, lng: -122.4170, bikeId: "bike_1", speedKmh: 0.0 },
];

// PUBLIC_INTERFACE
export function StoreProvider({ children }) {
  /** Provides app domain state for bikes/geofences/history/alerts (demo-first). */
  const [bikes, setBikes] = useState(demoBikes);
  const [alerts, setAlerts] = useState(demoAlerts);
  const [geofences, setGeofences] = useState(demoGeofences);
  const [history, setHistory] = useState(demoHistory);

  const api = useMemo(() => {
    return {
      bikes,
      alerts,
      geofences,
      history,
      // PUBLIC_INTERFACE
      addBike(name) {
        /** Add a bike (client-side). */
        const bike = { id: `bike_${Date.now()}`, name, status: "offline", lastSeen: "Never" };
        setBikes((b) => [bike, ...b]);
      },
      // PUBLIC_INTERFACE
      removeBike(id) {
        /** Remove a bike (client-side). */
        setBikes((b) => b.filter((x) => x.id !== id));
      },
      // PUBLIC_INTERFACE
      addAlert(alert) {
        /** Add an alert (client-side). */
        setAlerts((a) => [{ id: `al_${Date.now()}`, ...alert }, ...a]);
      },
      // PUBLIC_INTERFACE
      addGeofence(gf) {
        /** Add or update a geofence (client-side). */
        setGeofences((g) => [gf, ...g]);
      },
      // PUBLIC_INTERFACE
      removeGeofence(id) {
        /** Remove a geofence (client-side). */
        setGeofences((g) => g.filter((x) => x.id !== id));
      },
      // PUBLIC_INTERFACE
      addHistoryPoint(pt) {
        /** Add a history point (client-side). */
        setHistory((h) => [{ id: `pt_${Date.now()}`, ...pt }, ...h]);
      },
    };
  }, [bikes, alerts, geofences, history]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

// PUBLIC_INTERFACE
export function useStore() {
  /** Hook to access the app store. */
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
