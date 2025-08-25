import axios from "axios";
import { removeLocalStorageItems, setLocalStorageItems } from "./utils";

const API = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if token expired and we haven't retried yet
    if (error.response && error.response.status === 401) {
      if (
        error.response.data?.message === "token-expired" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const userId = localStorage.getItem("uuid");

          if (!refreshToken || !userId) {
            removeLocalStorageItems(["token", "refreshToken"]);
            window.location.href = "/auth/login";
            return;
          }

          const { data } = await axios.post("/api/auth/refresh", {
            userId,
            refreshToken,
          });

          const newAccessToken = data.accessToken;
          setLocalStorageItems([
            { key: "token", value: newAccessToken },
            { key: "refreshToken", value: data.refreshToken },
          ]);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return API(originalRequest);
        } catch (err) {
          console.error("Refresh Token error:", err);
          removeLocalStorageItems(["token"]);
          window.location.href = "/auth/login";
        }
      } else {
        removeLocalStorageItems(["token"]);
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  },
);

export default API;
