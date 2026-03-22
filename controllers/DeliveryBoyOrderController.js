import mongoose from "mongoose";
import { Order } from "../models/order.js";
import { DeliveryBoy } from "../models/deliveryboy.js";
import { User } from "../models/user.js";
 import { DeliveryProductpdf } from "../utils/generatepdf.js";
import { sendInvoiceEmail,sendSimpleEmail} from "../utils/sendemail.js";


// STEP 1: Verify Delivery Boy
export const verifyDeliveryBoyForPickup = async (req, res) => {
  try {
    const { name, aadhaar, mobile } = req.body;

    const deliveryBoy = await DeliveryBoy.findOne({ name, aadhaar, mobile });

    if (!deliveryBoy) {
      return res.status(400).json({
        success: false,
        message: "You are not registered as a delivery boy."
      });
    }
    // Send deliveryBoyId via email
    const emailMsg = `Hello ${deliveryBoy.name},\n\nYour DeliveryBoy ID is: ${deliveryBoy._id}\nUse this ID along with Master Order ID to pickup products.\n\nThank you.`;
    await sendSimpleEmail(deliveryBoy.email, "Your DeliveryBoy ID - APNACART", emailMsg);


    res.json({
      success: true,
      verified: true,
      deliveryBoyId: deliveryBoy._id,
      message: "Delivery boy verified. Now enter masterOrderId to pickup."
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// STEP 2: Pickup Products
export const pickupProducts = async (req, res) => {
  try {
    const { deliveryBoyId, masterOrderId } = req.body;

    //  Check required fields
    if (!deliveryBoyId || !masterOrderId) {
      return res.status(400).json({
        success: false,
        message: "deliveryBoyId and masterOrderId are required"
      });
    }

    //  Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(deliveryBoyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid DeliveryBoy ID format"
      });
    }

    //  Check delivery boy exists
    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "Delivery boy not found"
      });
    }

    //  Check delivery boy verified
    if (!deliveryBoy.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Delivery boy not verified"
      });
    }

    // Find orders
    const orders = await Order.find({
      masterOrderId,
      status: { $in: ["Shipped", "ArrivedAtCity", "Packing"] }
    });

    if (!orders || orders.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No orders found for this masterOrderId"
      });
    }
    for (const order of orders) {
      const user = await User.findById(order.user);
      if (!user) continue;

      // 1. Correct User Details for Delivery Boy
      const userInfo = `
CUSTOMER DETAILS:
Name: ${order.shippingAddress.fullName}
Phone: ${order.shippingAddress.mobile}
Address: ${order.shippingAddress.Village},
 ${order.shippingAddress.PostOffice}, 
 ${order.shippingAddress.District}, 
 ${order.shippingAddress.city},
  ${order.shippingAddress.state} - ${order.shippingAddress.pincode}

PRODUCTS:
${order.items.map(i => `- ${i.title} (Qty: ${i.quantity})`).join("\n")}
      `;

      await sendSimpleEmail(deliveryBoy.email, "Customer Pickup Details - APNACART", userInfo);

      // 2. Generate 6 digit OTP a
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit

      
      order.deliveryOTP = {
        code: otpCode,
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days expiry
        verified: false
      };
      
      await order.save();

      // 3. Send OTP to USER
      const userMsg = `Your OTP for delivery is: ${otpCode}. Please share this with the delivery boy. Valid for 3 days.`;
      await sendSimpleEmail(user.email, "Your Delivery OTP - APNACART", userMsg);
    }

    res.json({
      success: true,
      message: "Details sent to delivery boy & OTP sent to user"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// STEP 3: Confirm Delivery (Update OTP Check)
export const confirmDelivery = async (req, res) => {
  try {
    const {  masterOrderId, userOtp } = req.body;

    
    const order = await Order.findOne({ masterOrderId }).populate("user");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // 2. OTP Check 
    if (order.deliveryOTP.code !== userOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > order.deliveryOTP.expiresAt) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // 3. Mark Delivered
    order.status = "Delivered";
    order.tracking.deliveredAt = new Date();
    order.deliveryOTP.verified = true;
    await order.save();

    // 4. Generate & Send PDF
    const user = await User.findById(order.user);
    if (user) {
      const pdfPath = await DeliveryProductpdf(order, user);
      
      await sendInvoiceEmail(user.email, pdfPath); 
      console.log(`PDF sent to ${user.email}`);
    }

    res.json({
      success: true,
      message: "Delivery confirmed and PDF sent to user's email."
    });

  } catch (error) {
    console.error("Confirm Delivery Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};