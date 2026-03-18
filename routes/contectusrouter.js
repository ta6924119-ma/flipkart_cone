import { createContactMessage } from "../controllers/contactUSController.js";
 import { Router } from "express";

const router = Router();

// Create a contact message
router.post("/contact", createContactMessage);
export const contactUsRouter = router;