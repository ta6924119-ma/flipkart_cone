import { Wishlist } from "../models/wishlist.js";
// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    if (wishlist.products.includes(productId)) {
      return res.status(400).json({ message: "Product is already in wishlist" });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    res.status(200).json({ message: "Product added to wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const wishlist = await Wishlist.findOne({ user: userId }).populate("products");

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    res.status(200).json({ wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
    await wishlist.save();

    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Clear wishlist
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = [];
    await wishlist.save();

    res.status(200).json({ message: "Wishlist cleared" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
