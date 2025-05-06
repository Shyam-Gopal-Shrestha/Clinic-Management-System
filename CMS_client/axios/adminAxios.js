import axios from "axios";

const ADMIN_API_URL = "http://localhost:8000/api/admin"; // Replace with your backend API URL

// Fetch pending users
export const getPendingUsers = async () => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/pending-users`);
    return response.data; // Return the API response
  } catch (error) {
    console.error(
      "Error fetching pending users:",
      error.response?.data || error.message
    );
    return {
      status: "error",
      message: error.response?.data?.message || "Failed to fetch pending users",
    };
  }
};

// Verify user (approve or reject)
export const verifyUser = async (userId, isApproved) => {
  try {
    const response = await axios.post(`${ADMIN_API_URL}/verify-user`, {
      userId,
      isApproved,
    });
    return response.data; // Return the API response
  } catch (error) {
    console.error(
      "Error verifying user:",
      error.response?.data || error.message
    );
    return {
      status: "error",
      message: error.response?.data?.message || "Failed to verify user",
    };
  }
};
