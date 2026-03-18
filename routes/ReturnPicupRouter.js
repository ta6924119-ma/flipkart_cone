import { adminApproveReturn,deliveryBoyPickup } from "../controllers/ReturnpickupController.js";
import { protect } from "../middleware/authmiddlewere.js";
import { adminProtect } from "../middleware/adminmiddleware.js";
import { Router } from "express";

const router = Router();

// Delivery boy
router.post("/pickup/:returnId", protect, deliveryBoyPickup);

// Admin approval
router.post("/approve/:returnId", protect, adminProtect, adminApproveReturn);