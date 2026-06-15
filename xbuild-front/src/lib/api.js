const TOKEN_KEY = "xbuild_admin_token";

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY); }
  catch { return null; }
}

export function setToken(token) {
  try {
    if (!token) localStorage.removeItem(TOKEN_KEY);
    else localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

export async function apiFetch(path, { auth = false, ...options } = {}) {
  const headers = new Headers(options.headers || {});

  // Only set Content-Type for non-FormData bodies
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const url = path.startsWith("/api") || path.startsWith("/uploads")
    ? path
    : `/api${path}`;

  const res = await fetch(url, { ...options, headers });

  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const msg = typeof body === "object" && body?.error ? body.error : `Erreur ${res.status}`;
    throw new Error(msg);
  }
  return body;
}
