import{ verifyDeliveryBoyForPickup, pickupProducts, confirmDelivery } from "../controllers/DeliveryBoyOrderController.js";

import express from "express";
const router = express.Router();

//  verify delivery boy
router.post("/verify-self", verifyDeliveryBoyForPickup);

//  pickup products / master ID
router.post("/pickup-product", pickupProducts);

//  confirm delivery with OTP
router.post("/confirm-delivery", confirmDelivery);

export const deliveryBoyOrderRouter = router;