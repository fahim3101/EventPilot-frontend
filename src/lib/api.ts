import axios from "axios";

// In production we MUST have an explicit API URL. Falling back to
// localhost in prod is a silent footgun (CORS errors on Render backend).
const fallbackBaseURL =
  process.env.NODE_ENV === "production"
    ? (() => {
        // eslint-disable-next-line no-console
        console.error(
          "NEXT_PUBLIC_API_URL is not set! Falling back to localhost — this will break in production."
        );
        return "http://localhost:5000/api";
      })()
    : "http://localhost:5000/api";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || fallbackBaseURL,
  withCredentials: true,
});

// Attach token from localStorage as a fallback (in addition to the httpOnly
// cookie the backend sets), useful in dev across different ports.
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("eventpilot_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
