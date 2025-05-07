import axios from "axios";

const AVAILABILITY_API_URL = "http://localhost:8000/api/availability";

// Configure axios instance
const axiosInstance = axios.create({
  baseURL: AVAILABILITY_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const handleAddAvailability = async (availabilityData) => {
  try {
    console.log("Adding availability for doctor:", availabilityData.doctorId);

    const response = await axiosInstance.post("/", availabilityData);

    if (response.data.success) {
      console.log("Availability added successfully:", response.data);
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to add availability");
    }
  } catch (error) {
    console.error("Error adding availability:", error);
    handleError(error);
    throw error;
  }
};

export const fetchDoctorAvailability = async (doctorId) => {
  try {
    console.log("Fetching availability for doctor:", doctorId);

    const response = await axiosInstance.get(`/${doctorId}`);
    console.log("Raw availability response:", response.data);

    if (response.data && Array.isArray(response.data)) {
      // Filter out past dates
      const currentDate = new Date();
      return response.data.filter((slot) => new Date(slot.date) >= currentDate);
    }

    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      // Handle response with data wrapper
      const currentDate = new Date();
      return response.data.data.filter(
        (slot) => new Date(slot.date) >= currentDate
      );
    }

    console.warn("Unexpected response format:", response.data);
    return [];
  } catch (error) {
    console.error("Error fetching availability:", error);
    throw error;
  }
};

// Helper function to validate time format (HH:MM AM/PM)
const isValidTimeFormat = (time) => {
  const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;
  return timeRegex.test(time);
};

// Error handling helper
const handleError = (error) => {
  console.error("Error details:", error);

  if (error.response) {
    // Server responded with error
    const message = error.response.data.message || "Unknown server error";
    alert(`Error: ${message}`);
  } else if (error.request) {
    // No response received
    alert(
      "Could not connect to server. Please check your internet connection."
    );
  } else {
    alert("An unexpected error occurred. Please try again.");
  }
};
