import { Router } from "express";
import {
  signup,
  verificationEamilOTP,
  resendOTP,
  login,
  profile,
  addAddress,
  updateAddress,
  getAddress,
  updateProfile,
  deleteAddress,
} from "../controllers/authController.js";
import { protect } from "../middleware/authmiddleware.js";

const route = Router();




//  Request & Response Logger Middleware
route.use((req, res, next) => {
  ``;
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

//  Profile routes
route.get("/profile", protect, profile);
route.put("/profile", protect, updateProfile);
route.patch("/profile", protect, updateProfile);

//  Add address
route.post("/address", protect, addAddress);
//  Update address
route.put("/address/:id", protect, updateAddress);
route.patch("/address/:id", protect, updateAddress);
//  Delete address
route.delete("/address/:id", protect, deleteAddress);
//  Get address
route.get("/address/get", protect, getAddress);
export const router = route;
