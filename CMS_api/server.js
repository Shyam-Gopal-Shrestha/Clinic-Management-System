import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv"; // Import dotenv to load environment variables
import userRouter from "./Routes/userRouter.js";
import adminRouter from "./Routes/adminRouter.js";
import conMongoDb from "./config/mongodbConfig.js";
import seedAdmin from "./utility/seedAdmin.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000; // Use the PORT from .env or default to 8000

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await conMongoDb();

    // Seed the admin account
    await seedAdmin();

    // Start the server
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1); // Exit the process if the server fails to start
  }
};

startServer();
