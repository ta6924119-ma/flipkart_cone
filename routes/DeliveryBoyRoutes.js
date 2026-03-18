import express from "express";
import {
  registerDeliveryBoy,
  verifyOtp,
  loginDeliveryBoy,
  updateDeliveryBoy,
  deleteDeliveryBoy,
  getAllDeliveryBoys,
  adminDeleteDeliveryBoy
} from "../controllers/DeliveryBoyController.js";
import { deliveryBoyProtect} from "../middleware/DeliveryBoyMiddleware.js";
import{adminProtect} from "../middleware/adminmiddleware.js";
import{superAdminProtect} from "../middleware/SuperAdminMiddleware.js";

const router = express.Router();

// Public
router.post("/register", registerDeliveryBoy);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginDeliveryBoy);

// DeliveryBoy self
router.put("/update", deliveryBoyProtect, updateDeliveryBoy);
router.delete("/delete", deliveryBoyProtect, deleteDeliveryBoy);

// Admin or SuperAdmin
router.get("/admin/all", adminProtect,superAdminProtect, getAllDeliveryBoys);
router.delete("/admin/:id", adminProtect, superAdminProtect, adminDeleteDeliveryBoy);

export const deliveryBoyRoutes = router;