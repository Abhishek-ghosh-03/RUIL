import axios from "axios";

// 🔥 Use the production URL when deployed, otherwise use localhost
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: baseURL
});

export const searchComponents = (params) =>
  API.get("/components/search", { params });

export const generateLayoutAI = (payload) =>
  API.post("/ai/generate", payload);