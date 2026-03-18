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
} from "../controllers/adminController.js";
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
route.get("/users/:id",  adminProtect, getUserDetails);


export const Routeradmin = route;