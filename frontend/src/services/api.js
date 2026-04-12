import axios from "axios";

// 🔥 Normalize API URL to ensure it always includes /api
let rawBaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
if (rawBaseURL.endsWith('/')) rawBaseURL = rawBaseURL.slice(0, -1);
const baseURL = rawBaseURL.includes('/api') ? rawBaseURL : `${rawBaseURL}/api`;

const API = axios.create({
  baseURL: baseURL
});

export const searchComponents = (params) =>
  API.get("/components/search", { params });

export const generateLayoutAI = (payload) =>
  API.post("/ai/generate", payload);

export const fetchLibraryUpdates = (libraryId) =>
  API.get(`/library-updates/${libraryId}`);