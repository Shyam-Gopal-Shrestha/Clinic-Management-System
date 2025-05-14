import axios from "axios";

// const USER_API_URL = "http://localhost:8000/api/users";

// Deployment code
const USER_API_URL = "https://clinic-management-system-mmgx.onrender.com";

// Create axios instance with common config
const axiosInstance = axios.create({
  baseURL: USER_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000, // 20 second timeout
});

// Create user | signup
export const createUser = async (userObj) => {
  try {
    console.log("Sending signup request:", {
      ...userObj,
      password: "[REDACTED]", // Log everything except password
    });

    // Fix: Use the complete endpoint path
    const response = await axiosInstance.post("/api/users/signup", userObj);
    const { data } = response;

    // Validate response format
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format from server");
    }

    // If signup is successful
    if (data.success) {
      return {
        status: "success",
        success: true,
        message: data.message || "Signup successful",
        data: data.data,
      };
    }

    // If signup failed but server returned a message
    return {
      status: "error",
      success: false,
      message: data.message || "Signup failed",
    };
  } catch (error) {
    // Enhanced error logging
    console.error("Signup error:", {
      name: error.name,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Return structured error response
    return {
      status: "error",
      success: false,
      message:
        error.response?.status === 404
          ? "Signup endpoint not found. Please check the API URL."
          : error.response?.status === 500
          ? "Server error. Please try again later."
          : error.response?.data?.message || "Signup failed. Please try again.",
      errors: error.response?.data?.errors || [],
    };
  }
};

// // Login user
// export const loginUser = async (credentials) => {
//   try {
//     // Add request debugging
//     console.log("Sending login request:", {
//       url: USER_API_URL + "/login",
//       email: credentials.email,
//       hasPassword: !!credentials.password,
//     });

//     const response = await axiosInstance.post("/login", credentials);

//     // Log full response for debugging
//     console.log("Full server response:", {
//       status: response.status,
//       statusText: response.statusText,
//       data: response.data,
//     });

//     // Validate response structure
//     if (!response.data) {
//       throw new Error("Invalid response format from server");
//     }

//     // Handle successful response
//     if (response.data.success && response.data.data) {
//       // Store user data in localStorage
//       localStorage.setItem("user", JSON.stringify(response.data.data));

//       return {
//         status: "success",
//         success: true,
//         data: response.data.data,
//         message: response.data.message || "Login successful",
//       };
//     }

//     // Handle error response with message
//     return {
//       status: "error",
//       success: false,
//       message: response.data.message || "Login failed",
//     };
//   } catch (error) {
//     // Enhanced error logging
//     console.error("Login error:", {
//       name: error.name,
//       message: error.message,
//       status: error.response?.status,
//       statusText: error.response?.statusText,
//       data: error.response?.data,
//       config: {
//         url: error.config?.url,
//         method: error.config?.method,
//         headers: error.config?.headers,
//       },
//     });

//     // Return structured error response
//     return {
//       status: "error",
//       success: false,
//       message:
//         error.response?.status === 500
//           ? "Server error. Please try again later."
//           : error.response?.data?.message || "Login failed",
//     };
//   }
// };

// deployment code for login user
export const loginUser = async (credentials) => {
  try {
    // Debugging: Log the request payload (omit password)
    console.log("Sending login request:", {
      email: credentials.email,
      hasPassword: !!credentials.password,
    });

    // Send POST request to /login
    // const response = await axiosInstance.post("/login", credentials);
    const response = await axiosInstance.post("/api/users/login", credentials);

    const { data } = response;

    // Validate response format
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format from server");
    }

    const { success, message, data: userData } = data;

    if (success && userData) {
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      return {
        status: "success",
        success: true,
        data: userData,
        message: message || "Login successful",
      };
    }

    // Handle failed login attempt
    return {
      status: "error",
      success: false,
      message: message || "Login failed",
    };
  } catch (error) {
    const errorDetails = {
      name: error.name,
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    };

    console.error("Login error:", errorDetails);

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
    console.log("Doctors response:", response.data);

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch doctors");
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
