import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import "leaflet/dist/leaflet.css";

import { AuthProvider, useAuth } from "./state/auth";
import { AppLayout } from "./components/layout/AppLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { BikesPage } from "./pages/BikesPage";
import { LiveTrackingPage } from "./pages/LiveTrackingPage";
import { HistoryPage } from "./pages/HistoryPage";
import { GeofencesPage } from "./pages/GeofencesPage";
import { AlertsPage } from "./pages/AlertsPage";
import { SettingsPage } from "./pages/SettingsPage";

function RequireAuth({ children }) {
  const { session, loading } = useAuth();
  if (loading) return <div className="pageCenter">Loading…</div>;
  if (!session) return <Navigate to="/login" replace />;
  return children;
}

function AuthRedirectHome() {
  const { session, loading } = useAuth();
  if (loading) return <div className="pageCenter">Loading…</div>;
  return <Navigate to={session ? "/app" : "/login"} replace />;
}

// PUBLIC_INTERFACE
function App() {
  /** App entry: sets up providers and routes for the BikeTrack Pro frontend. */
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthRedirectHome />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/app"
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="bikes" element={<BikesPage />} />
            <Route path="live" element={<LiveTrackingPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="geofences" element={<GeofencesPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
