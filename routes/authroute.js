import { Router } from "express";
import {
  signup,
  verificationEamilOTP,
  resendOTP,
  login,
} from "../controllers/authController.js";

const route = Router();

// 🔹 Request & Response Logger Middleware
route.use((req, res, next) => {
  console.log("=================================");
  console.log(`[AUTH API] ${req.method} ${req.originalUrl}`);

  // Log request body
  if (Object.keys(req.body || {}).length > 0) {
    console.log("➡️ Request Body:", req.body);
  } else {
    console.log("➡️ Request Body: Empty");
  }

  // Capture response body
  const originalSend = res.send;
  res.send = function (body) {
    console.log("⬅️ Response Status:", res.statusCode);
    console.log("⬅️ Response Body:", body);
    console.log("=================================");
    return originalSend.call(this, body);
  };

  next();
});

// Routes
route.post("/signup", signup);
route.post("/verify", verificationEamilOTP);
route.post("/resendOTP", resendOTP);
route.post("/login", login);

export const router = route;
