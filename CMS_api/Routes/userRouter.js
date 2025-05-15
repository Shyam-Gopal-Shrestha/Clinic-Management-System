import express from "express";
import { comparePassword, hashPassword } from "../utility/bcryptHelper.js";
import {
  buildSuccessResponse,
  buildErrorResponse,
} from "../utility/responseHelper.js";
import User, {
  findUserByEmail,
  createUser,
  findDoctors,
} from "../Models/userModel.js";

const userRouter = express.Router();

// create user | Signup Endpoint
userRouter.post("/signup", async (req, res) => {
  try {
    const { password, role } = req.body;

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Determine if the user should be verified by default
    const isVerified = role === "Patient"; // Only patients are verified by default

    // Save the user to the database
    const result = await createUser({
      ...req.body,
      password: hashedPassword,
      isVerified, // Set the isVerified field
    });

    // Check if the user was created successfully
    if (result?._id) {
      buildSuccessResponse(res, result, "User created successfully!!");
    } else {
      buildErrorResponse(res, "Could not create user!!");
    }
  } catch (error) {
    console.error("Error during user creation:", error);

    // Handle duplicate email error
    if (error.code === 11000) {
      return buildErrorResponse(res, "User with this email already exists!!");
    }

    // Handle other errors
    buildErrorResponse(res, "An error occurred during user creation.");
  }
});

// Login route
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Add request logging
    console.log("Login attempt for:", email);

    // Input validation
    if (!email || !password) {
      return buildErrorResponse(res, "Email and password are required");
    }

    const user = await findUserByEmail(email);
    console.log(
      "User found:",
      user ? { role: user.role, id: user._id } : "No user"
    );

    if (!user) {
      return buildErrorResponse(res, "Invalid credentials", 401);
    }

    // Validate password
    const isPasswordCorrect = await comparePassword(password, user.password);
    console.log(
      "Password validation:",
      isPasswordCorrect ? "passed" : "failed"
    );

    if (!isPasswordCorrect) {
      return buildErrorResponse(res, "Invalid credentials", 401);
    }

    // Check if user is a doctor and is verified
    if (user.role === "Doctor" && !user.isVerified) {
      return buildErrorResponse(res, "Account pending verification", 403);
    }

    // Prepare user data for response
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      // Add doctorId for doctor role
      ...(user.role === "Doctor" && { doctorId: user._id }),
    };

    console.log("Login successful for:", {
      id: userData.id,
      name: userData.name,
      role: userData.role,
      isVerified: userData.isVerified,
    });

    return buildSuccessResponse(res, userData, "Login successful");
  } catch (error) {
    console.error("Login error:", {
      message: error.message,
      stack: error.stack,
    });
    return buildErrorResponse(res, "An error occurred during login", 500);
  }
});

// Logout route
userRouter.post("/logout", async (req, res) => {
  try {
    // Clear any server-side session/tokens if needed
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during logout",
      error: error.message,
    });
  }
});

// Get all doctors
userRouter.get("/doctors", async (req, res) => {
  try {
    console.log("Fetching doctors...");

    const doctors = await User.find({
      role: "Doctor",
      isVerified: true,
    }).select("-password");

    console.log("Found doctors:", doctors.length);

    if (!doctors || doctors.length === 0) {
      return buildErrorResponse(res, "No doctors found", 404);
    }

    return buildSuccessResponse(res, doctors, "Doctors fetched successfully");
  } catch (error) {
    console.error("Error in /doctors route:", error);
    return buildErrorResponse(res, "Failed to fetch doctors", 500);
  }
});

export default userRouter;
