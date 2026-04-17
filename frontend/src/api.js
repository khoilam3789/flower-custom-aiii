const envApiBase = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL;
export const API_BASE = (envApiBase || (import.meta.env.DEV ? "http://localhost:5000" : "")).replace(/\/$/, "");

export const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!API_BASE) {
    throw new Error("Missing frontend env VITE_BACKEND_URL (or VITE_API_URL) in production.");
  }
  return `${API_BASE}${normalizedPath}`;
};

export const fetchJson = async (path, options = {}) => {
  const url = buildApiUrl(path);
  const res = await fetch(url, options);
  const contentType = res.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const text = await res.text();
    const preview = text.slice(0, 120).replace(/\s+/g, " ");
    throw new Error(`API returned non-JSON (${res.status}) from ${url}: ${preview}`);
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || `API error ${res.status}`);
  }

  return data;
};

export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
