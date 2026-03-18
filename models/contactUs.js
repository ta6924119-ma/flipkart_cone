import mongoose from "mongoose";
import { type } from "os";
const contactUsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
export const ContactUs = new mongoose.model("ContactUs", contactUsSchema);
