import { requestReturn } from "../controllers/ReturnController.js";
import { protect } from "../middleware/authmiddleware.js";
import { Router } from "express";

const router = Router();

router.post("/return/:orderId", protect, requestReturn);

export const returnRouter = router;