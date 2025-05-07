import express from "express";
import mongoose from "mongoose";
import Availability from "../Models/availabilityModel.js";

const availabilityRouter = express.Router();

// Add logging middleware
availabilityRouter.use((req, res, next) => {
  console.log(`Availability Route - ${req.method} ${req.url}`);
  next();
});

// Get availability for a specific doctor
availabilityRouter.get("/:doctorId", async (req, res) => {
  const { doctorId } = req.params;
  console.log("Fetching availability for doctorId:", doctorId);

  try {
    // Validate doctorId
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid doctor ID format" });
    }

    const availability = await Availability.find({
      doctorId: doctorId,
    }).sort({ date: 1 });

    console.log("Found availability:", availability);

    if (!availability || availability.length === 0) {
      return res
        .status(404)
        .json({ message: "No availability found for this doctor" });
    }

    res.status(200).json(availability);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default availabilityRouter;
