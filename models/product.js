import mongoose from "mongoose";
import { type } from "os";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    category: {
      type: String,
      required: true,
    }, // mobile, shoes, books
    brand: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    }, // multiple images
    price: {
      type: Number,
      required: true,
    },
    oldPrice: Number,
    discount: Number,
    finalPrice: Number,
    stock: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    sizes: {
      type: [String],
    },
    colors: {
      type: [String],
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Unisex"],
      default: "Unisex",
    },
    features: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

productSchema.pre("save", async function () {
  this.finalPrice = this.discount
    ? this.price - (this.price * this.discount) / 100
    : this.price;
});

export const Product = mongoose.model("Product", productSchema);
