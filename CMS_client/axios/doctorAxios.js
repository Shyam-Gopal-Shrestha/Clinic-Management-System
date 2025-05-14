import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error('API URL not found in environment variables');
  throw new Error('API URL is required');
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

// Add request/response interceptors for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error("Connection Error:", {
        url: error.config?.baseURL + error.config?.url,
        error: error.message
      });
    }
    return Promise.reject(error);
  }
);

export const fetchDoctors = async () => {
  try {
    const response = await axiosInstance.get("/api/users/doctors");
    const { data } = response;

    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format from server");
    }

    if (data.success && Array.isArray(data.data)) {
      return {
        status: "success",
        success: true,
        data: data.data,
        message: "Doctors fetched successfully",
      };
    }

    throw new Error(data.message || "Failed to fetch doctors");
  } catch (error) {
    console.error("Error fetching doctors:", {
      name: error.name,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    return {
      status: "error",
      success: false,
      message:
        error.code === "ERR_NETWORK"
          ? "Unable to connect to server. Please try again later."
          : error.response?.data?.message || "Failed to fetch doctors",
      errors: error.response?.data?.errors || [],
    };
  }
};
