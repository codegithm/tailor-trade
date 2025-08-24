export const BACKEND_URL =
  (import.meta.env.VITE_BACKEND_URL as string) ||
  (import.meta.env.BACKEND_URL as string) ||
  "http://localhost:4000";
