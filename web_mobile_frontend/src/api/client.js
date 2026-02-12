/**
 * Minimal API client wrapper around fetch with bearer token support.
 * Backend base URL is configured via REACT_APP_API_BASE (fallback REACT_APP_BACKEND_URL).
 */

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_URL ||
  "http://localhost:3001";

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the configured backend base URL. */
  return API_BASE;
}

function buildUrl(path) {
  if (!path.startsWith("/")) return `${API_BASE}/${path}`;
  return `${API_BASE}${path}`;
}

async function readJsonSafe(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = "GET", token, body, headers } = {}) {
  /**
   * Performs a JSON request to the backend.
   * @param {string} path - URL path (e.g. "/healthz").
   * @param {object} options - method/token/body/headers
   * @returns {Promise<{ok: boolean, status: number, data: any}>}
   */
  const url = buildUrl(path);
  const finalHeaders = {
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers || {}),
  };

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await readJsonSafe(res);

  return { ok: res.ok, status: res.status, data };
}
