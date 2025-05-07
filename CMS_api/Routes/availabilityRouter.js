import express from "express";
import mongoose from "mongoose";
import Availability from "../Models/availabilityModel.js";

const availabilityRouter = express.Router();

// Add logging middleware
availabilityRouter.use((req, res, next) => {
  console.log(`Availability Route - ${req.method} ${req.url}`);
  next();
});

// POST route to create new availability
availabilityRouter.post("/", async (req, res) => {
  try {
    const { doctorId, date, start, end } = req.body;

    // Validate required fields
    if (!doctorId || !date || !start || !end) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields. Need doctorId, date, start, and end times",
      });
    }

    // Validate doctorId format
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID format",
      });
    }

    // Create new availability
    const newAvailability = new Availability({
      doctorId,
      date: new Date(date),
      start,
      end,
    });

    const savedAvailability = await newAvailability.save();
    console.log("Created availability:", savedAvailability);

    // Return success response with consistent format
    return res.status(201).json({
      success: true,
      data: savedAvailability,
      message: "Availability added successfully",
    });
  } catch (error) {
    console.error("Error creating availability:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create availability",
      error: error.message,
    });
  }
});

// Get availability for a specific doctor
availabilityRouter.get("/:doctorId", async (req, res) => {
  const { doctorId } = req.params;
  console.log("Fetching availability for doctorId:", doctorId);

  try {
    // Validate doctorId
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID format",
      });
    }

    const availability = await Availability.find({
      doctorId: doctorId,
    }).sort({ date: 1 });

    console.log("Found availability:", availability);

    if (!availability || availability.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No availability found for this doctor",
      });
    }

    return res.status(200).json({
      success: true,
      data: availability,
      message: "Availability fetched successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

export default availabilityRouter;
