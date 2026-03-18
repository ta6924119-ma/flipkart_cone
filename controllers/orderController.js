import { Order } from "../models/order.js";
import { Cart } from "../models/cart.js";
import { Product } from "../models/product.js";
import {
  generateInvoice,
  generateCancel,
  DeliveryProductpdf,
} from "../utils/generatepdf.js";
import { sendInvoiceEmail } from "../utils/sendemail.js";
import { User } from "../models/user.js";
import { v4 as uuidv4 } from "uuid";

// ===== SINGLE API: DIRECT OR CART ORDER =====
export const placeOrder = async (req, res) => {
  try {
    const { productId, quantity = 1, address, paymentMethod } = req.body;

    // Fetch user
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Use provided shippingAddress or user's default
    const addressToUse = req.body.shippingAddress || user.address[0];
    if (!addressToUse) {
      return res
        .status(400)
        .json({ message: "Please fill your shipping address first" });
    }
    let orderItems = [];
    let totalPrice = 0;

    if (productId) {
      // Direct order
      const product = await Product.findById(productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      if (product.stock < quantity)
        return res
          .status(400)
          .json({ message: `Only ${product.stock} items available` });

      orderItems.push({
        product: product._id,
        quantity,
        price: product.finalPrice,
        totalItemPrice: product.finalPrice * quantity,
        title: product.title,
        images: product.images,
      });
      totalPrice = product.finalPrice * quantity;

      // Reduce stock
      product.stock -= quantity;
      await product.save();
    } else {
      // Cart order
      const cart = await Cart.findOne({ user: req.user._id }).populate(
        "items.product",
      );
      if (!cart || cart.items.length === 0)
        return res.status(400).json({ message: "Cart is empty" });

      for (const item of cart.items) {
        const product = await Product.findById(item.product._id);
        if (!product || product.stock < item.quantity)
          return res
            .status(400)
            .json({ message: `Insufficient stock for ${product?.title}` });

        orderItems.push({
          product: product._id,
          quantity: item.quantity,
          price: item.price,
          totalItemPrice: item.totalItemPrice,
          title: product.title,
          images: product.images,
        });
        totalPrice += item.totalItemPrice;

        // Reduce stock
        product.stock -= item.quantity;
        await product.save();
      }

      // Clear cart
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    }

    // Delivery charge
    const deliveryCharge = totalPrice < 3000 ? 50 : 0;
    const finalAmount = totalPrice + deliveryCharge;
    const masterOrderId = "ORD-" + uuidv4().slice(0, 8);

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: addressToUse,
      paymentMethod: paymentMethod || "COD",
      deliveryCharge,
      totalAmount: finalAmount,
      paymentStatus: paymentMethod === "COD" ? "Paid" : "Pending",
      masterOrderId,
      status: "Pending",
    });

    // Generate PDF & email for COD
    if (paymentMethod === "COD") {
      try {
        const invoicePath = await generateInvoice(order, user);
        await sendInvoiceEmail(user.email, invoicePath);
      } catch (err) {
        console.log("COD invoice email error:", err.message);
      }
    }

    res.status(201).json({
      success: true,
      message: `Order placed successfully${paymentMethod === "COD" ? " (Invoice sent)" : ""}`,
      order,
    });
  } catch (error) {
    // Console.error("Place Order Error:", error);
    res
      .status(500)
      .json({ message: "Failed to place order", error: error.message });
    // res.status(500).json({ message: "Failed to place order", error: error.message });
  }
};
//CENCEL ORDER
export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    //  Cancel only if not delivered
    if (order.status === "Delivered") {
      return res.status(400).json({
        message: "Order cannot be cancelled after delivery",
      });
    }

    //  Status change
    order.status = "Cancelled";
    order.cancelReason = reason || "No reason provided";
    order.cancelledAt = new Date();

    await order.save();

    //  STOCK WAPAS ADD KARO
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    const user = await User.findById(order.user);

    //  Cancel PDF generate
    const pdfPath = await generateCancel(order, user);

    //  Email send
    await sendInvoiceEmail(user.email, pdfPath);

    res.json({
      success: true,
      message: "Order cancelled successfully & PDF sent to email",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      "Pending",
      "Packing",
      "Shipped",
      "ArrivedAtCity",
      "OutForDelivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id).populate("user");
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    if (status === "Packing") order.tracking.packingAt = new Date();
    if (status === "Shipped") order.tracking.shippedAt = new Date();
    if (status === "ArrivedAtCity") order.tracking.arrivedAtCityAt = new Date();
    if (status === "OutForDelivery")
      order.tracking.outForDeliveryAt = new Date();
    if (status === "Delivered") order.tracking.deliveredAt = new Date();
    await order.save();

    if (status === "Delivered") {
      try {
        const user = await User.findById(order.user._id);

        // Generate PDF with product, amount, delivery charge, user details
        const pdfPath = await DeliveryProductpdf(order, user);

        // Send PDF to user's email
        await sendInvoiceEmail(user.email, pdfPath);

        console.log(`Delivery PDF sent successfully to ${user.email}`);
      } catch (err) {
        console.error("Error sending delivery PDF:", err.message);
      }
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

//  GET USER,S ORDER
export const getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("items.product", "title images")
    .sort({ createdAt: -1 });

  // map orders to include tracking times in user-friendly format
  const formattedOrders = orders.map((order) => {
    return {
      _id: order._id,
      masterOrderId: order.masterOrderId,
      status: order.status,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      deliveryCharge: order.deliveryCharge,
      items: order.items.map((i) => ({
        title: i.title,
        quantity: i.quantity,
        price: i.price,
        totalItemPrice: i.totalItemPrice,
        images: i.images,
      })),
      tracking: {
        packingAt: order.tracking?.packingAt || null,
        shippedAt: order.tracking?.shippedAt || null,
        arrivedAtCityAt: order.tracking?.arrivedAtCityAt || null,
        outForDeliveryAt: order.tracking?.outForDeliveryAt || null,
        deliveredAt: order.tracking?.deliveredAt || null,
        cancelledAt: order.tracking?.cancelledAt || null,
      },
    };
  });

  res.json({ success: true, orders: formattedOrders });
};
//GET ADMIN ALL ORDERS
export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("items.product", "title")
    .sort({ createdAt: -1 });

  res.json({ success: true, orders });
};
