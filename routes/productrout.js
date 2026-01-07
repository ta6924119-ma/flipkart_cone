import { Router } from "express";
import {
  getProduct,
  productById,
  putProduct,
  createProduct,
  patchProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { upload } from "../utils/multer.js";

const router = Router();

// ---- GET ---- //
router.get("/product", getProduct);        // all products
router.get("/product/:id", productById);   // single product

// ---- POST ---- //
router.post("/product", upload.array("images", 100), createProduct);

// ---- PUT / PATCH ---- //
router.put("/product/:id", putProduct);
router.patch("/product/:id", patchProduct);

// ---- DELETE ---- //
router.delete("/product/:id", deleteProduct);

export const Routerproduct = router;
