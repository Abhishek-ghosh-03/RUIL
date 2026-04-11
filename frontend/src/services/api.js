import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const searchComponents = (params) =>
  API.get("/components/search", { params });

export const generateLayoutAI = (payload) =>
  API.post("/ai/generate", payload);