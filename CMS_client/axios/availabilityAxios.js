import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
console.log("Current API URL:", API_URL); // Debug log

// Configure axios instance
const axiosInstance = axios.create({
  baseURL: `${API_URL}/api/availability`,
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
      console.log(
        "Availability API Request:",
        config.method.toUpperCase(),
        config.url
      );
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

export const handleAddAvailability = async (availabilityData) => {
  try {
    console.log("Adding availability for doctor:", availabilityData.doctorId);

    // Validate time format before sending
    if (
      !isValidTimeFormat(availabilityData.start) ||
      !isValidTimeFormat(availabilityData.end)
    ) {
      throw new Error("Invalid time format. Please use HH:MM AM/PM format");
    }

    const response = await axiosInstance.post("/", availabilityData);
    const { data } = response;

    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format from server");
    }

    return {
      status: data.success ? "success" : "error",
      success: !!data.success,
      message:
        data.message ||
        (data.success
          ? "Availability added successfully"
          : "Failed to add availability"),
      data: data.data,
    };
  } catch (error) {
    console.error("Error adding availability:", {
      name: error.name,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    return {
      status: "error",
      success: false,
      message: error.response?.data?.message || "Failed to add availability",
      errors: error.response?.data?.errors || [],
    };
  }
};

export const fetchDoctorAvailability = async (doctorId) => {
  try {
    console.log("Fetching availability for doctor:", doctorId);

    const response = await axiosInstance.get(`/${doctorId}`);
    const { data } = response;

    // Normalize response format
    const availabilityData = Array.isArray(data) ? data : data?.data || [];

    // Filter out past dates and sort by date
    const currentDate = new Date();
    return availabilityData
      .filter((slot) => new Date(slot.date) >= currentDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((slot) => ({
        ...slot,
        date: new Date(slot.date).toLocaleDateString(),
        formattedTime: `${slot.start} - ${slot.end}`,
      }));
  } catch (error) {
    console.error("Error fetching availability:", {
      name: error.name,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

// Helper function to validate time format (HH:MM AM/PM)
const isValidTimeFormat = (time) => {
  const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;
  return typeof time === "string" && timeRegex.test(time);
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
