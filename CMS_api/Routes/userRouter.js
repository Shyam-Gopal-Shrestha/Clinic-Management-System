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
    const { password } = req.body;

    const hashedPassword = hashPassword(password);
    // Query to db to saev user
    const result = await createUser({ ...req.body, password: hashedPassword });

    result?._id
      ? buildSuccessResponse(res, result, "user created successfully!!")
      : buildErrorResponse(res, "could not create user!!");
  } catch (error) {
    if (error.code === 11000) {
      error.message = "User with this email already exists!!";
    }
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
    // if login successful
    buildSuccessResponse(res, null, "Login Successful");
  } catch (error) {
    console.log("error during login", error);
    buildErrorResponse(res, "Failed to login");
  }
});

export default userRouter;
