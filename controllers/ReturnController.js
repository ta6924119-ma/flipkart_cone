import { Order } from "../models/order.js";

// USER REQUEST RETURN (7 Days Policy)
export const requestReturn = async (req, res) => {
  try {
    const { masterOrderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({
      masterOrderId,
      user: req.user._id, // user sirf apna order return kare
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check delivered or not
    if (!order.tracking?.deliveredAt) {
      return res.status(400).json({
        success: false,
        message: "Order not delivered yet",
      });
    }

    // Check 7 days limit
    const diffDays =
      (Date.now() - order.tracking.deliveredAt) /
      (1000 * 60 * 60 * 24);

    if (diffDays > 7) {
      return res.status(400).json({
        success: false,
        message: "Return window closed (7 days over)",
      });
    }

    // Already requested?
    if (order.returnRequest?.requested) {
      return res.status(400).json({
        success: false,
        message: "Return already requested",
      });
    }

    order.returnRequest = {
      requested: true,
      reason: reason || "No reason provided",
      requestedAt: new Date(),
      approved: false,
    };

    order.status = "ReturnRequested";

    await order.save();

    res.json({
      success: true,
      message: "Return request submitted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};