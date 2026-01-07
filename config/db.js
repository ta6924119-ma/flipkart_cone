import mongoose from "mongoose";
 import dotenv from "dotenv"
 dotenv.config()

export const dbclint = async () => {
  try {
    const db_url = process.env.MONGODB_URL
    await mongoose.connect(db_url);
    console.log("mongodb is connected");
  } catch (error) {
    console.log("mongodb is not connected", error);
  }
};
