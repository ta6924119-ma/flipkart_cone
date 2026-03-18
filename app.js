import express from "express";
import dotenv from "dotenv";
import { dbclint } from "./config/db.js";
import mongoose from "mongoose";
import os from "os";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env
dotenv.config();

import { createSuperAdmin} from "./utils/cheksuperAdmin.js";
import{ Routeradmin } from "./routes/adminrouter.js";
import { SuperAdminrouter } from "./routes/superAdminrouter.js";
import { router } from "./routes/authroute.js";
import { Routerproduct } from "./routes/productrouter.js";
import { cardRouter } from "./routes/cartRouter.js";
import { RouterOrder } from "./routes/orderRouter.js";
import { deliveryBoyRoutes } from "./routes/DeliveryBoyRoutes.js";
import { contactUsRouter } from "./routes/contectusrouter.js";
import { trackOrderRouter } from "./routes/trackOrderRouter.js";
import { returnRouter } from "./routes/ReturnRouter.js";
import { deliveryBoyOrderRouter } from "./routes/orderDeliveryBoyRouter.js";
import { wishlistRouter } from "./routes/wishlistRouter.js";

const app = express();

// --------------------
// ES Module __dirname FIX
// --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------
// MongoDB Connection
// --------------------
dbclint();
await createSuperAdmin(); // Create SuperAdmin if not exists

// --------------------
// Middlewares
// --------------------
app.use(express.json());

// CORS — Allow All Origins
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --------------------
// Request Logging Middleware
// --------------------
app.use((req, res, next) => {
  console.log("📨 Incoming Request:");  
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Body:", JSON.stringify(req.body, null, 2));
  next();
});

// --------------------
// Routes
// --------------------
app.use("/api/superadmin", SuperAdminrouter);
app.use("/api/admin", Routeradmin);
app.use("/api", router);
app.use("/api/product", Routerproduct);
app.use("/api/cart", cardRouter);
app.use("/api/order", RouterOrder);
app.use("/api/delivery-boy", deliveryBoyRoutes);
app.use("/api", contactUsRouter);
app.use("/api/track", trackOrderRouter);
app.use("/api/return", returnRouter);
app.use("/api/delivery-boy-order", deliveryBoyOrderRouter);
app.use("/api/wishlist", wishlistRouter);


console.log("API routes mounted at /api");
console.log("orders routes mounted at /api/order");

// --------------------
// Start Server
// --------------------
const port = process.env.PORT || 4040;

app.listen(port, "0.0.0.0", () => {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }

  console.log("CONNECTED DB NAME:", mongoose.connection.name);
  console.log(`Server running on port ${port}`);
  console.log("Access backend using:");

  addresses.forEach((addr) => {
    console.log(`http://${addr}:${port}`);
  });
});
