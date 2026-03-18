import jwt from "jsonwebtoken";
import { DeliveryBoy } from "../models/deliveryboy.js";

export const deliveryBoyProtect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Not authorized" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const deliveryBoy = await DeliveryBoy.findById(decoded.id);
    if (!deliveryBoy)
      return res.status(401).json({ message: "Delivery boy not found" });

    req.deliveryBoy = deliveryBoy;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

export const admin = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};
