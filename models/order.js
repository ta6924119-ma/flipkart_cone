import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalItemPrice: { type: Number, required: true },
  title: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
     masterOrderId: {
      type: String,
      required: true,
      index: true,
    },

    items: [orderItemSchema],

    shippingAddress: {
      fullName: String,
      mobile: String,
      pincode: String,
      city: String,
      state: String,
      District: String,
      PostOffice: String,
      fullAddress: String,
      Village: String,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    paymentId: String,

    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },

     status: {
      type: String,
      enum: [
        "Pending",
        "Packing",
        "Shipped",
        "ArrivedAtCity",
        "OutForDelivery",
        "Delivered",
        "Cancelled",
        "ReturnRequested",
        "Returned",
      ],
      default: "Pending",
    },
     tracking: {
      packingAt: Date,
      shippedAt: Date,
      arrivedAtCityAt: Date,
      outForDeliveryAt: Date,
      deliveredAt: Date,
    },
     deliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryBoy",
    },
        deliveryOTP: {
      code: String,
      expiresAt: Date,
      verified: {
        type: Boolean,
        default: false,
      },
    },


    cancelReason: {
      type: String,
    },

    cancelledAt: {
      type: Date,
    },
    // Return Request
     returnRequest: {
      requested: {
        type: Boolean,
        default: false,
      },
      reason: String,
      requestedAt: Date,
      approved: {
        type: Boolean,
        default: false,
      },
      returnedAt: Date,
    },
  },

  
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
