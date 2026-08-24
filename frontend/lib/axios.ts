import axios from "axios";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "/api"
    : "http://localhost:5000/api");

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

export default api;
