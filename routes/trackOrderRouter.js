import { trackOrder } from "../controllers/trackOrderController.js";
import { protect } from "../middleware/authmiddleware.js";
import { Router } from "express";

const router = Router();

router.get("/track/:masterOrderId", protect, trackOrder);

export const trackOrderRouter = router;