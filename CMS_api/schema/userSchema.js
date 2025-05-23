// filepath: /path/to/userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["Doctor", "Patient", "Receptionist", "Admin"],
  },
  isVerified: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

export default User; // Export the Mongoose model
