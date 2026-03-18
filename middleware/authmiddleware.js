

import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/user.js";

// Optional: Warn early if JWT_SECRET is missing (safe to keep in dev)
if (!process.env.JWT_SECRET) {
  console.warn("  JWT_SECRET is not set in environment variables!");
}

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ensure decoded.id exists and is a valid ObjectId
      if (!decoded.id || !mongoose.Types.ObjectId.isValid(decoded.id)) {
        return res.status(401).json({ message: "Not authorized" });
      }

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      return next();
    } catch (error) {
      // Only expose details in development for debugging
      if (process.env.NODE_ENV === "development") {
        console.error("Auth Error:", error.message);
      }
      return res.status(401).json({ message: "Not authorized" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" });
};

/*export const admin = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access only" });
};*/
