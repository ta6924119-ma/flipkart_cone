import { Router } from "express";
import {
  placeOrder,
  cancelOrder,
  getUserOrders,
} from "../controllers/orderController.js"
import { protect } from "../middleware/authmiddleware.js";
// import{adminProtect} from "../middleware/adminmiddleware.js";
// import {superAdminProtect} from "../middleware/SuperAdminMiddleware.js";
const router = Router();

//  Place order (user)
router.post("/order", protect, placeOrder);

//  Get user's order history
router.get("/my-orders", protect, getUserOrders);

//user cencel order
router.patch("/:id/cancel", protect, cancelOrder);



//  Admin: Update order status
//  router.patch("/order/:id/status", protect, updateOrderStatus);

// //  Admin:  and superAdmin: Get all orders
// router.get("/order", protect, adminProtect, superAdminProtect, getAllOrders);

export const RouterOrder = router;
