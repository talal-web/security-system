import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (process.env.NODE_ENV === "production" && !apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL must be set for production builds");
}

const api = axios.create({
  baseURL: apiUrl || "http://localhost:5000/api",
  withCredentials: true,
});

export default api;
