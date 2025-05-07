import express from "express";
import { comparePassword, hashPassword } from "../utility/bcryptHelper.js";
import {
  buildSuccessResponse,
  buildErrorResponse,
} from "../utility/responseHelper.js";
import { createUser, findUserByEmail } from "../Models/userModel.js";

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
    const user = await findUserByEmail(email);
    if (!user) {
      return buildErrorResponse(res, "User not found!!");
    }

    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return buildErrorResponse(res, "Invalid credentials!!");
    }

    // if login successful, include user role and other details in the response
    const userData = {
      role: user.role, // Assuming the user object has a 'role' field
      name: user.name, // Optional: Include other user details if needed
      email: user.email,
      id: user._id, // Include the user's ID
    };

    buildSuccessResponse(res, userData, "Login Successful");
  } catch (error) {
    console.log("error during login", error);
    buildErrorResponse(res, "Failed to login");
  }
});

export default userRouter;
