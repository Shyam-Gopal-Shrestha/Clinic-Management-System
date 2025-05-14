import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === "production") {
  dotenv.config();
} else {
  dotenv.config({ path: ".env.local" });
}

const MONGO_URL = process.env.MONGO_URL;
const NODE_ENV = process.env.NODE_ENV || "development";

// MongoDB connection options
const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

const conMongoDb = async () => {
  try {
    const isLocalDb =
      MONGO_URL.includes("127.0.0.1") || MONGO_URL.includes("localhost");
    console.log(
      `🔌 Connecting to MongoDB (${NODE_ENV}):`,
      isLocalDb ? "Local Database" : "Remote Database"
    );

    const conn = await mongoose.connect(MONGO_URL, mongoOptions);

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected successfully");
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default conMongoDb;
