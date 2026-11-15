import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
// A missing deployment URL should make API-backed screens show request errors,
// not throw while importing this module and leave the entire app blank.
const apiBaseUrl = configuredApiUrl || (import.meta.env.DEV ? "http://localhost:5000/api" : "/api");

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

export { apiBaseUrl };
