import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Named export "api" — required by AuthContext.jsx
export const api = API;

export const registerUser    = (data) => API.post("/register", data);
export const loginUser       = (data) => API.post("/login", data);
export const analyzeText     = (text) => API.post("/analyze-text",     { text });
export const analyzePhishing = (text) => API.post("/analyze-phishing", { text });

// "analyzeURL" (capital URL) — required by URLAnalyzer.jsx and ReportGenerator.jsx
export const analyzeURL      = (url)  => API.post("/analyze-url",      { url });

export const generateReport  = (input_text, analysis_result) =>
  API.post("/generate-report", { input_text, analysis_result }, { responseType: "blob" });

export default API;
