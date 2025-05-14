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
const PORT = process.env.PORT || 8000;

// Configure CORS
// const corsOptions = {
//   origin: "http://localhost:5173", // Your React frontend URL
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// CORS options for deployment
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://clinic-management-system-eta-olive.vercel.app", // deployed frontend
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Middleware
app.use(cors(allowedOrigins));
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

// Start server
// const startServer = async () => {
//   try {
//     await conMongoDb();
//     await seedAdmin();

//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//       console.log(
//         `API Documentation available at http://localhost:${PORT}/api-docs`
//       );
//     });
//   } catch (error) {
//     console.error("Error starting the server:", error);
//     process.exit(1);
//   }
// };

// deployment code
const startServer = async () => {
  try {
    await conMongoDb(); // Establish connection

    // Only run seed after ensuring Mongoose is ready
    mongoose.connection.once("open", async () => {
      console.log("Mongo connection open");
      await seedAdmin(); // Now safe to seed
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API Documentation at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();
