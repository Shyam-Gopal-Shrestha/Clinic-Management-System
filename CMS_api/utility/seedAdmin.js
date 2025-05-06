import User from "../schema/userSchema.js";
import { hashPassword } from "./bcryptHelper.js";

const seedAdmin = async () => {
  try {
    // Check if an admin account already exists
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("Admin account already exists");
    } else {
      // Hash the admin password
      const hashedPassword = await hashPassword("admin123");

      // Create the admin account
      const admin = new User({
        name: "Admin",
        contactNumber: "1234567890",
        address: "Admin Address",
        email: "admin@example.com",
        password: hashedPassword,
        role: "Admin",
        isVerified: true, // Admin is verified by default
      });

      await admin.save();
      console.log("Admin account created successfully");
    }
  } catch (error) {
    console.error("Error seeding admin account:", error.message, error.stack);
  }
};

export default seedAdmin;
