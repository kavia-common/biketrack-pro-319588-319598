import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../state/auth";
import { StoreProvider } from "../../state/store";

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      end={to === "/app"}
      className={({ isActive }) => `navItem ${isActive ? "navItemActive" : ""}`}
    >
      <span>{label}</span>
    </NavLink>
  );
}

// PUBLIC_INTERFACE
export function AppLayout() {
  /** Main authenticated dashboard layout (sidebar + topbar + routed content). */
  const { session, logout } = useAuth();
  const nav = useNavigate();

  return (
    <StoreProvider>
      <div className="shell">
        <aside className="sidebar">
          <div className="brand">
            <div className="brandMark" aria-hidden="true" />
            <div>
              <div style={{ fontWeight: 800, lineHeight: 1.1 }}>BikeTrack Pro</div>
              <div className="muted" style={{ fontSize: 12 }}>
                {session?.user?.email || "Signed in"}
              </div>
            </div>
          </div>

          <nav className="nav" aria-label="Primary navigation">
            <NavItem to="/app" label="Dashboard" />
            <NavItem to="/app/bikes" label="Bikes" />
            <NavItem to="/app/live" label="Live tracking" />
            <NavItem to="/app/history" label="History" />
            <NavItem to="/app/geofences" label="Geofences" />
            <NavItem to="/app/alerts" label="Alerts" />
            <NavItem to="/app/settings" label="Settings" />
          </nav>

          <div style={{ padding: 8 }}>
            <button
              className="btn"
              onClick={() => {
                logout();
                nav("/login");
              }}
              style={{ width: "100%" }}
            >
              Sign out
            </button>
          </div>
        </aside>

        <main className="main">
          <header className="topbar">
            <div style={{ fontWeight: 700 }}>BikeTrack Pro</div>
            <div className="topbarRight">
              <span className="badge">
                API: {process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || "unset"}
              </span>
            </div>
          </header>

          <div className="container">
            <Outlet />
          </div>
        </main>
      </div>
    </StoreProvider>
  );
}
