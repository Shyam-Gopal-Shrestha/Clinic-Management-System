import axios from "axios";

const DOCTOR_API_URL = "http://localhost:8000/api/users/doctors";

export const fetchDoctors = async () => {
  try {
    const response = await axios.get(DOCTOR_API_URL, {
      withCredentials: true,
    });

    // Make sure we're returning the data array
    return Array.isArray(response.data.data) ? response.data : { data: [] };
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return { data: [] };
  }
};
