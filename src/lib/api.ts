import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
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
