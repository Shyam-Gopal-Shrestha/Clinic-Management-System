import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
console.log("Admin API URL:", API_URL); // Debug log

// Configure axios instance
const axiosInstance = axios.create({
  baseURL: `${API_URL}/api/admin`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method.toUpperCase()} request to: ${config.baseURL}${
        config.url
      }`
    );
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error("Server Connection Error:", {
        url: error.config?.baseURL + error.config?.url,
        message: error.message,
      });
    }
    return Promise.reject(error);
  }
);

// Get pending users
export const getPendingUsers = async () => {
  try {
    const response = await axiosInstance.get("/pending-users");
    return {
      status: "success",
      data: Array.isArray(response.data)
        ? response.data
        : response.data.data || [],
    };
  } catch (error) {
    console.error("Error fetching pending users:", error);
    return {
      status: "error",
      data: [], // Always return an array even on error
      message:
        error.code === "ERR_NETWORK"
          ? "Unable to connect to server. Please check if the server is running."
          : "Failed to fetch pending users",
    };
  }
};

// Verify user
export const verifyUser = async (userId, isApproved) => {
  try {
    const response = await axiosInstance.post("/verify-user", {
      userId,
      isApproved,
    });
    return {
      status: "success",
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error verifying user:", error);
    return {
      status: "error",
      message:
        error.code === "ERR_NETWORK"
          ? "Unable to connect to server. Please try again later."
          : error.response?.data?.message || "Failed to verify user",
    };
  }
};

export default axiosInstance;
