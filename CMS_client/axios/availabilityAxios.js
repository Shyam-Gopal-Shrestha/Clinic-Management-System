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

export const handleAddAvailability = async (
  newAvailability,
  setAvailability,
  setNewAvailability
) => {
  // Validate input
  if (
    !newAvailability?.start ||
    !newAvailability?.end ||
    !newAvailability?.date
  ) {
    alert("Please fill all fields!");
    return;
  }

  try {
    const doctorId = localStorage.getItem("doctorId");
    if (!doctorId) {
      alert("Doctor ID is missing. Please log in again.");
      return;
    }

    // Validate time format
    if (
      !isValidTimeFormat(newAvailability.start) ||
      !isValidTimeFormat(newAvailability.end)
    ) {
      alert("Invalid time format. Please use HH:MM AM/PM format");
      return;
    }

    const requestData = {
      doctorId,
      date: newAvailability.date.toISOString(),
      start: newAvailability.start,
      end: newAvailability.end,
    };

    console.log("Sending availability data:", requestData);

    const response = await axiosInstance.post("/", requestData);

    console.log("Server response:", response.data);

    setAvailability((prev) => [
      ...prev,
      {
        ...newAvailability,
        id: response.data._id,
        doctorId,
      },
    ]);

    setNewAvailability({ date: new Date(), start: "", end: "" });
    alert("Availability added successfully!");
  } catch (error) {
    handleError(error);
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

export const fetchDoctorAvailability = async (doctorId) => {
  try {
    if (!doctorId) {
      throw new Error("Doctor ID is required");
    }

    const response = await axiosInstance.get(`/${doctorId}`);
    return response.data;
  } catch (error) {
    handleError(error);
    return [];
  }
};
