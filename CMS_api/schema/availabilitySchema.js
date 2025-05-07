import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User schema for doctors
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Availability", availabilitySchema);
