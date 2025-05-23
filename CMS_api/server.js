import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRouter from "./Routes/userRouter.js";
import adminRouter from "./Routes/adminRouter.js";
import conMongoDb from "./config/mongodbConfig.js";
import seedAdmin from "./utility/seedAdmin.js";
import availabilityRouter from "./Routes/availabilityRouter.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS options for deployment
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "http://localhost:3000", // alternate local
  "https://clinic-management-system-eta-olive.vercel.app", // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked CORS for:", origin); // Debug log
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Access-Control-Allow-Origin"],
    maxAge: 86400, // CORS preflight cache for 24 hours
  })
);

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/availability", availabilityRouter);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// Deployment server startup
const startServer = async () => {
  try {
    await conMongoDb(); // Establish connection

    // Only run seed after ensuring Mongoose is ready
    mongoose.connection.once("open", async () => {
      console.log("MongoDB connected successfully");
      await seedAdmin(); // Seed admin user after connection is ready
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();
