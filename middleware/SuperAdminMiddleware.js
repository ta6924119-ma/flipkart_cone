import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { SuperAdmin } from "../models/superAdmin.js";

if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET is not set in environment variables!");
}

// Middleware: protect route for logged-in SuperAdmin
export const superAdminProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Validate decoded id
      if (!decoded.id || !mongoose.Types.ObjectId.isValid(decoded.id)) {
        return res.status(401).json({ message: "Not authorized" });
      }

      const superAdmin = await SuperAdmin.findById(decoded.id);

      if (!superAdmin) {
        return res.status(401).json({ message: "SuperAdmin not found" });
      }

      req.superAdmin = superAdmin;
      return next();
    } catch (error) {
      console.error("SuperAdmin Auth Error:", error.message);
      return res.status(401).json({ message: "Not authorized" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware: ensure only SuperAdmin can access
export const isSuperAdmin = (req, res, next) => {
  if (req.superAdmin) {
    return next();
  }
  return res.status(403).json({ message: "SuperAdmin access only" });
};