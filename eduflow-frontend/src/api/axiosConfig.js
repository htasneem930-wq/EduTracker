import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081",
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("eduflow_user"));
  if (user && user.id) {
    config.headers["X-User-Id"] = user.id;
  }
  return config;
});

export default API;