import express from "express";
import mongoose from "mongoose";
import Availability from "../Models/availabilityModel.js";

const availabilityRouter = express.Router();

// Add availability
availabilityRouter.post("/", async (req, res) => {
  const { doctorId, date, start, end } = req.body;

  console.log("Received Data:", { doctorId, date, start, end }); // Debugging

  try {
    // Validate required fields
    if (!doctorId || !date || !start || !end) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate doctorId as a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    // Validate date format
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Save availability to the database
    const availability = new Availability({
      doctorId,
      date: parsedDate, // Ensure the date is stored as a valid Date object
      start,
      end,
    });

    const savedAvailability = await availability.save();
    res.status(201).json(savedAvailability);
  } catch (error) {
    console.error("Error adding availability:", error);
    res.status(500).json({ message: "Failed to add availability" });
  }
});

export default availabilityRouter;
