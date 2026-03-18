import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.js";

export const adminProtect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find admin in DB
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ success: false, error: "Admin not found" });
    }

    

    // Attach admin to request
    req.admin = admin;
    next();
  } catch (error) {
    console.error("AdminProtect Error:", error.message);
    res.status(401).json({ success: false, error: "Not authorized" });
  }
};
