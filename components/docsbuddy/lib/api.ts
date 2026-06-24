function getApiBase(): string {
  const base = process.env.NEXT_API_URL ?? "http://localhost:8001";
  return base.replace(/\/$/, "");
}

export const API_BASE_URL = getApiBase();

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
