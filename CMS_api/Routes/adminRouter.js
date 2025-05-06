import express from "express";
import User from "../schema/userSchema.js";
const adminRouter = express.Router();

// The AdminDashboard already fetches users with isVerified: false. Ensure the backend API for fetching pending users filters by isVerified: false.
adminRouter.get("/pending-users", async (req, res) => {
  try {
    const pendingUsers = await User.find({ isVerified: false }); // Fetch only unverified users
    res.status(200).json({
      status: "success",
      data: pendingUsers,
    });
  } catch (error) {
    console.error("Error fetching pending users:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch pending users",
    });
  }
});

// Ensure the API for verifying users updates the isVerified field to true when a user is approved.
adminRouter.post("/verify-user", async (req, res) => {
  const { userId, isApproved } = req.body;

  try {
    if (isApproved) {
      await User.findByIdAndUpdate(userId, { isVerified: true });
      res.status(200).json({
        status: "success",
        message: "User approved successfully",
      });
    } else {
      await User.findByIdAndDelete(userId);
      res.status(200).json({
        status: "success",
        message: "User rejected successfully",
      });
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to verify user",
    });
  }
});

export default adminRouter;
// adminRouter.get("/users", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json({
//       status: "success",
//       data: users,
//     });
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({
//       status: "error",
//       message: "Failed to fetch users",
//     });
//   }
// });
// adminRouter.delete("/delete-user/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     await User.findByIdAndDelete(id);
//     res.status(200).json({
//       status: "success",
//       message: "User deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     res.status(500).json({
//       status: "error",
//       message: "Failed to delete user",
//     });
//   }
// });
// adminRouter.get("/doctors", async (req, res) => {
//   try {
//     const doctors = await User.find({ role: "Doctor" });
//     res.status(200).json({
//       status: "success",
//       data: doctors,
//     });
//   } catch (error) {
//     console.error("Error fetching doctors:", error);
//     res.status(500).json({
//       status: "error",
//       message: "Failed to fetch doctors",
//     });
//   }
// });
// adminRouter.get("/patients", async (req, res) => {
//   try {
//     const patients = await User.find({ role: "Patient" });
//     res.status(200).json({
//       status: "success",
//       data: patients,
//     });
//   } catch (error) {
//     console.error("Error fetching patients:", error);
//     res.status(500).json({
//       status: "error",
//       message: "Failed to fetch patients",
//     });
//   }
// });
// adminRouter.get("/receptionists", async (req, res) => {
//   try {
//     const receptionists = await User.find({ role: "Receptionist" });
//     res.status(200).json({
//       status: "success",
//       data: receptionists,
//     });
//   } catch (error) {
//     console.error("Error fetching receptionists:", error);
//     res.status(500).json({
//       status: "error",
//       message: "Failed to fetch receptionists",
//     });
//   }
// });
