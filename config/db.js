import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const dbclint = async () => {
  try {
    const db_url = process.env.MONGODB_URL;
    await mongoose.connect(db_url);
      console.log(" MongoDB is connected to database:", mongoose.connection.name);
  } catch (error) {
    console.log("mongodb is not connected", error);
  }
};
