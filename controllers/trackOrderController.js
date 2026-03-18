import { Order } from "../models/order.js";

// USER TRACK ORDER
export const trackOrder = async (req, res) => {
  try {
    const { masterOrderId } = req.params;

    const order = await Order.findOne({
      masterOrderId,
      user: req.user._id, // user sirf apna order dekh sake
    }).populate("deliveryBoy", "name mobile email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(201).json({
      success: true,
      masterOrderId: order.masterOrderId,
      status: order.status,
      tracking: {
        packingTime: order.tracking?.packingAt,
        shippedTime: order.tracking?.shippedAt,
        arrivedAtCityTime: order.tracking?.arrivedAtCityAt,
        outForDeliveryTime: order.tracking?.outForDeliveryAt,
        deliveredTime: order.tracking?.deliveredAt,
      },
      deliveryBoy: order.deliveryBoy || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};