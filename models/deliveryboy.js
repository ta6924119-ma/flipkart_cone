import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    aadhaar: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    city: String,
    state: String,
    address: String,
    otp:{
      type:String
    } ,
    otpExpires: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const DeliveryBoy =  new mongoose.model("DeliveryBoy", deliverySchema);
