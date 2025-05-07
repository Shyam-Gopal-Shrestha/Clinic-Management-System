// filepath: /Users/shyamshrestha/Project_Code/CMS/CMS_api/Models/availabilityModel.js
import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
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
