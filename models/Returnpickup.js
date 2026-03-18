import mongoose from "mongoose";

const returnPickupSchema = new mongoose.Schema(
  {
    masterOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userDetails: {
      name: String,
      mobile: String,
      address: String,
    },
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
    pickupStatus: {
      type: String,
      enum: ["Pending", "Assigned", "Picked", "Completed"],
      default: "Pending",
    },
    pickupDeliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryBoy",
    },
    deliveredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryBoy",
      required: true,
    },
    returnReason: String,
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    pickedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

export const ReturnPickup = mongoose.model("ReturnPickup", returnPickupSchema);