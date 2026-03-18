import { loginSuperAdmin,
    createAdmin,
    getAdmins,
    updateAdmin,
    deleteAdmin,
    createProductSuperAdmin,
    updateProductSuperAdmin,
    deleteProductSuperAdmin, getAllUsers,getUserDetails,blockUser,getAllProductsSuperAdmin,getSuperAdminProductById} from "../controllers/superAdminController.js";

import { superAdminProtect } from "../middleware/SuperAdminMiddleware.js";
import { upload } from "../utils/multer.js";
import { Router } from "express";

const router = Router();

// SuperAdmin login
router.post("/login",loginSuperAdmin);


// Create Admin
router.post("/admin", createAdmin);

// Get all Admins
router.get("/admin", getAdmins);

// Update Admin
router.put("/admin/:id", updateAdmin);
router.patch("/admin/:id", updateAdmin);

// Delete Admin
router.delete("/admin/:id", deleteAdmin);


/* =====================================================
  SUPERADMIN ROUTES (CRUD)
===================================================== */

// CREATE PRODUCT
router.post(
  "/product",
  superAdminProtect,
  upload.array("images", 2),
  createProductSuperAdmin,
);

// UPDATE PRODUCT
router.put(
  "/product/:id",
  superAdminProtect,
  upload.array("images", 2),
  updateProductSuperAdmin,
);
router.patch(
  "/product/:id",
  superAdminProtect,
  upload.array("images", 2),
  updateProductSuperAdmin,
);

// DELETE PRODUCT
router.delete("/product/:id", superAdminProtect, deleteProductSuperAdmin);
// GET ALL PRODUCTS (SuperAdmin)
router.get("/products", superAdminProtect, getAllProductsSuperAdmin);
router.get("/products/:id", superAdminProtect, getSuperAdminProductById);



// SuperAdmin User Management
router.get("/users", superAdminProtect, getAllUsers);
router.get("/users/:id", superAdminProtect, getUserDetails);
router.put("/users/:id/block", superAdminProtect, blockUser);


export  const SuperAdminrouter = router;