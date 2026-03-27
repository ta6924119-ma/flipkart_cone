import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/CartController.js";

 import { protect } from "../middleware/authmiddleware.js";

const router = Router();

// All routes require login
router.use(protect);


router.get("/cart", getCart);
router.post("/add-to-cart", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove", removeFromCart);

export const cardRouter = router;
