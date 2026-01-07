import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["mobile", "shoes", "books"],
      required: true,
    },
    brand: {
      type: String,
      required: true, // iphone, samsung, nike
    },
    images: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    oldPrice: Number,
    discount: Number,
    storage: String,
    features: [String],
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
