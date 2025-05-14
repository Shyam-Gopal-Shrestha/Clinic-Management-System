import axios from "axios";

const USER_API_URL = import.meta.env.VITE_API_URL;
console.log("Current API URL:", USER_API_URL || "http://localhost:5000"); // Debug log

const axiosInstance = axios.create({
  baseURL: USER_API_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

// Add request/response interceptors for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      console.log("API Request:", config.method.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error("Server Connection Error. Check if the server is running.");
    }
    return Promise.reject(error);
  }
);

// Create user | signup
export const createUser = async (userObj) => {
  try {
    const response = await axiosInstance.post("/api/users/signup", userObj);
    const { data } = response;

    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format from server");
    }

    return {
      status: data.success ? "success" : "error",
      success: !!data.success,
      message:
        data.message || (data.success ? "Signup successful" : "Signup failed"),
      data: data.data,
      details: !data.success ? data.error || data.details : undefined,
    };
  } catch (error) {
    console.error("Signup error:", {
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
          : error.response?.data?.message || "Signup failed. Please try again.",
      errors: error.response?.data?.errors || [],
    };
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post("/api/users/login", credentials);
    const { data } = response;

    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format from server");
    }

    if (data.success && data.data) {
      localStorage.setItem("user", JSON.stringify(data.data));
      return {
        status: "success",
        success: true,
        data: data.data,
        message: data.message || "Login successful",
      };
    }

    return {
      status: "error",
      success: false,
      message: data.message || "Login failed",
    };
  } catch (error) {
    const errorMessage =
      error.code === "ERR_NETWORK"
        ? "Unable to connect to server. Please try again later."
        : error.response?.data?.message || "Login failed";

    console.error("Login error:", {
      name: error.name,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    return {
      status: "error",
      success: false,
      message: errorMessage,
    };
  }
};

// Fetch all doctors
export const fetchDoctors = async () => {
  try {
    const response = await axiosInstance.get("/api/users/doctors");
    const { data } = response;

    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format from server");
    }

    if (data.success) {
      return data.data;
    }

    throw new Error(data.message || "Failed to fetch doctors");
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem("user");
  return { status: "success", message: "Logged out successfully" };
};

// Check if user is logged in
export const isUserLoggedIn = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
