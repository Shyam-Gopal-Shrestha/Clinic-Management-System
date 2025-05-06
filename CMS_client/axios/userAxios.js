import axios from "axios";

const USER_API_URL = "http://localhost:8000/api/users";

// public Routes | Public Endpoints
// create user | signup
export const createUser = async (userObj) => {
  try {
    const response = await axios.post(`${USER_API_URL}/signup`, userObj);
    return response.data; // Return the API response
  } catch (error) {
    console.error("Signup API Error:", error.response?.data || error.message);
    return {
      status: "error",
      message:
        error.response?.data?.message || "An error occurred. Please try again.",
    };
  }
};

// login user
export const loginUser = async (userObj) => {
  try {
    const response = await axios.post(`${USER_API_URL}/login`, userObj);
    return response.data; // Return the data from the API response
  } catch (error) {
    console.error("Login API Error:", error.response?.data || error.message);
    return {
      status: "error",
      message:
        error.response?.data?.message || "An error occurred. Please try again.",
    }; // Return a consistent error structure
  }
};
