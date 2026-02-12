/**
 * WebSocket helper for streaming live telemetry.
 * Uses REACT_APP_WS_URL if available; otherwise attempts `${API_BASE.replace('http','ws')}/ws`.
 */

import { getApiBaseUrl } from "./client";

const WS_URL =
  process.env.REACT_APP_WS_URL ||
  (() => {
    const base = getApiBaseUrl();
    return `${base.replace("https://", "wss://").replace("http://", "ws://")}/ws`;
  })();

// PUBLIC_INTERFACE
export function createTelemetrySocket({ token } = {}) {
  /**
   * Create a WebSocket connection for telemetry.
   * If the backend expects token auth, it can be passed via query param (?token=...).
   */
  const url = token ? `${WS_URL}?token=${encodeURIComponent(token)}` : WS_URL;
  return new WebSocket(url);
}
