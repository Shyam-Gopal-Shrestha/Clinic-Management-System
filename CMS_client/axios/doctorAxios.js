import axios from "axios";

const BASE_URL = "http://localhost:8000/api/users";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchDoctors = async () => {
  try {
    console.log("Fetching doctors from:", `${BASE_URL}/doctors`);
    const response = await axiosInstance.get("/doctors");

    console.log("Doctors response:", response.data);

    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to fetch doctors");
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};
