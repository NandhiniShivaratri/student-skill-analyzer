import axios from "axios";

const api = axios.create({
  baseURL: "https://student-skill-analyzer-3-7ya9.onrender.com/api",
});

export default api;
