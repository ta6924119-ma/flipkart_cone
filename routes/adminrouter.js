import {
  loginAdmin,
  verifyAdminOTP,
  getDashboardStats,
  getRecentOrders,
  getTopProducts,
  getLowStockProducts,
  getMonthlyRevenue,
  getAllUsers,
  blockUser,
  getUserDetails,
  getAllProductsAdmin,
  getUsersProductsList,
  updateOrderStatus,
} from "../controllers/adminController.js";
import{getAllOrders} from "../controllers/orderController.js";
import { adminProtect } from "../middleware/adminmiddleware.js";
import { Router } from "express";

const route = Router();

//admin login and OTP verification
route.post("/login", loginAdmin);
route.post("/verify-otp", verifyAdminOTP);

route.get("/dashboard",  adminProtect, getDashboardStats);
route.get("/recent-orders",  adminProtect, getRecentOrders);
route.get("/top-products", adminProtect, getTopProducts);
route.get("/products", adminProtect, getAllProductsAdmin);
route.get("/low-stock",  adminProtect, getLowStockProducts);
route.get("/revenue",  adminProtect, getMonthlyRevenue);
route.get("/users", adminProtect, getAllUsers);
route.put("/users/:id/block",  adminProtect, blockUser);
route.get("/users/products",  adminProtect, getUsersProductsList);
route.get("/users/:id",  adminProtect, getUserDetails);
//order status update by admin
route.patch("/orders/:id/status",  adminProtect, updateOrderStatus);
//get all orders by admin
route.get("/orders",  adminProtect, getAllOrders);


export const Routeradmin = route;