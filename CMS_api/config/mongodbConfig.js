import mongoose from "mongoose";
import dotenv from "dotenv";

// loding .env variables
dotenv.config();

// Access MONGO_URL
const MONGO_URL = process.env.MONGO_URL;

console.log("mongoDB url: ", MONGO_URL); // Checking connection url from .env file

const conMongoDb = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URL);
    conn && console.log("Mongo Db Connected");
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};

export default conMongoDb;
