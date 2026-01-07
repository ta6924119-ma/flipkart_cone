import express from "express";
import { dbclint } from "./config/db.js";
import os from "os";
import cors from "cors";

import { router } from "./routes/authroute.js";
import { Routerproduct } from "./routes/productrout.js";

const app = express();

// ---- MongoDB Connection ---- //
dbclint();

// ---- Middleware ---- //
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// ---- Routes ---- //
app.use("/api", router);
app.use("/api/product", Routerproduct);

console.log("API routes mounted at /api");

// ---- Start Server ---- //
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

  console.log(`Server running on port ${port}`);
  console.log("Access backend using:");
  addresses.forEach((addr) => {
    console.log(`http://${addr}:${port}`);
  });
});
