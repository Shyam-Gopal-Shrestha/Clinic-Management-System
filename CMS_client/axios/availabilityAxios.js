import axios from "axios";

const AVAILABILITY_API_URL = "http://localhost:8000/api/availability"; // Replace with your backend API URL

export const handleAddAvailability = async (
  newAvailability,
  setAvailability,
  setNewAvailability
) => {
  if (newAvailability.start && newAvailability.end) {
    try {
      // Retrieve doctorId from localStorage
      const doctorId = localStorage.getItem("doctorId");
      console.log("Doctor ID:", doctorId); // Debugging
      if (!doctorId) {
        alert("Doctor ID is missing. Please log in again.");
        return;
      }

      // Prepare the request payload
      const requestData = {
        doctorId,
        date: newAvailability.date.toISOString(), // Ensure date is in ISO format
        start: newAvailability.start,
        end: newAvailability.end,
      };

      console.log("Request Data Sent to Backend:", requestData); // Debugging

      // Make the API request
      const response = await axios.post(`${AVAILABILITY_API_URL}`, requestData);

      // Handle successful response
      const savedAvailability = response.data;
      console.log("Saved Availability:", savedAvailability); // Debugging

      // Update the availability state
      setAvailability((prev) => [
        ...prev,
        { ...newAvailability, id: savedAvailability._id },
      ]);

      // Reset the newAvailability state
      setNewAvailability({ date: new Date(), start: "", end: "" });

      alert("Availability added successfully!");
    } catch (error) {
      // Handle errors
      if (error.response) {
        console.error("Error Response:", error.response.data); // Debugging
        alert(
          `Failed to add availability: ${
            error.response.data.message || "Unknown error"
          }`
        );
      } else if (error.request) {
        console.error("No Response Received:", error.request); // Debugging
        alert("Failed to connect to the server. Please try again.");
      } else {
        console.error("Error:", error.message); // Debugging
        alert("An error occurred. Please try again.");
      }
    }
  } else {
    alert("Please fill all fields!");
  }
};
