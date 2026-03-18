import { ReturnPickup } from "../models/Returnpickup.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";

// Admin approves return
export const adminApproveReturn = async (req, res) => {
  try {
    const { returnPickupId } = req.params;

    const returnPickup = await ReturnPickup.findById(returnPickupId);
    if (!returnPickup)
      return res.status(404).json({ message: "Return request not found" });

    returnPickup.approvedByAdmin = true;
    await returnPickup.save();

    res.json({
      success: true,
      message: "Return approved by admin",
      userDetails: returnPickup.userDetails,
      deliveredBy: returnPickup.deliveredBy,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delivery boy picks product
export const deliveryBoyPickup = async (req, res) => {
  try {
    const { returnPickupId } = req.body;
    const deliveryBoyId = req.user._id;

    const returnPickup = await ReturnPickup.findById(returnPickupId)
      .populate("masterOrderId")
      .populate("productId");

    if (!returnPickup)
      return res.status(404).json({ message: "Return request not found" });

    if (!returnPickup.approvedByAdmin)
      return res
        .status(400)
        .json({ message: "Return not approved by admin yet" });

    // Check if logged-in delivery boy is same as deliveredBy
    if (returnPickup.deliveredBy.toString() !== deliveryBoyId.toString()) {
      return res.status(403).json({
        message:
          "You are not authorized to pickup this product. Only the delivery boy who delivered it can pickup.",
      });
    }

    // Update pickup status
    returnPickup.pickupStatus = "Picked";
    returnPickup.pickupDeliveryBoy = deliveryBoyId;
    returnPickup.pickedAt = new Date();

    await returnPickup.save();

    // Restore product stock
    const product = await Product.findById(returnPickup.productId);
    if (product) {
      const itemInOrder = returnPickup.masterOrderId.items.find(
        (i) => i.product.toString() === product._id.toString()
      );
      product.stock += itemInOrder.quantity;
      await product.save();
    }

    res.json({
      success: true,
      message: "Product picked successfully",
      userDetails: returnPickup.userDetails,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message:"Failed to pickup product",
       error: error.message });
  }
};