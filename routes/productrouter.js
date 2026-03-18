import { Router } from "express";
import {
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
} from "../controllers/adminController.js";


import {
  getAllProducts,
  getProductById,
} from "../controllers/userProductController.js";
import { upload } from "../utils/multer.js";
import { adminProtect } from "../middleware/adminmiddleware.js";

const router = Router();

/* =====================================================
   ADMIN ROUTES (CRUD)
===================================================== */

// CREATE PRODUCT
router.post(
  "/admin/product",
  adminProtect,
  upload.array("images", 2),
  createProductAdmin,
);

// UPDATE PRODUCT
router.put(
  "/admin/product/:id",
  adminProtect,
  upload.array("images", 2),
  updateProductAdmin,
);
router.patch(
  "/admin/product/:id",
  adminProtect,
  upload.array("images", 2),
  updateProductAdmin,
);

// DELETE PRODUCT
router.delete("/admin/product/:id",  adminProtect, deleteProductAdmin);

/* =====================================================
   USER ROUTES (Read-Only)
===================================================== */

// GET ALL PRODUCTS
router.get("/product", getAllProducts);

// GET SINGLE PRODUCT
router.get("/product/:id", getProductById);

export const Routerproduct = router;
