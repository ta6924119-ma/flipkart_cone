import { addToWishlist,removeFromWishlist,clearWishlist,getWishlist } from "../controllers/wishlistController.js";
import { protect } from "../middleware/authmiddleware.js";
import { Router } from "express";

const route = Router();

route.post("/add",  protect, addToWishlist);
route.get("/", protect, getWishlist);
route.delete("/remove", protect, removeFromWishlist);
route.delete("/clear", protect, clearWishlist);

export const wishlistRouter = route;