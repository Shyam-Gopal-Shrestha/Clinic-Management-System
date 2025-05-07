import axios from "axios";

const USER_API_URL = "http://localhost:8000/api/users";

// Create axios instance with common config
const axiosInstance = axios.create({
  baseURL: USER_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // 5 second timeout
});

// Create user | signup
export const createUser = async (userObj) => {
  try {
    const response = await axiosInstance.post("/signup", userObj);
    return response.data;
  } catch (error) {
    console.error("Signup API Error:", error.response?.data || error.message);
    return {
      status: "error",
      message:
        error.response?.data?.message || "An error occurred. Please try again.",
    };
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    // Add request debugging
    console.log("Sending login request:", {
      url: USER_API_URL + "/login",
      email: credentials.email,
      hasPassword: !!credentials.password,
    });

    const response = await axiosInstance.post("/login", credentials);

    // Log full response for debugging
    console.log("Full server response:", {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });

    // Validate response structure
    if (!response.data) {
      throw new Error("Invalid response format from server");
    }

    // Handle successful response
    if (response.data.success && response.data.data) {
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.data));

      return {
        status: "success",
        success: true,
        data: response.data.data,
        message: response.data.message || "Login successful",
      };
    }

    // Handle error response with message
    return {
      status: "error",
      success: false,
      message: response.data.message || "Login failed",
    };
  } catch (error) {
    // Enhanced error logging
    console.error("Login error:", {
      name: error.name,
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      },
    });

    // Return structured error response
    return {
      status: "error",
      success: false,
      message:
        error.response?.status === 500
          ? "Server error. Please try again later."
          : error.response?.data?.message || "Login failed",
    };
  }
};

// Fetch all doctors
export const fetchDoctors = async () => {
  try {
    const response = await axiosInstance.get("/doctors");
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
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
