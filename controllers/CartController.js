import { Cart } from "../models/cart.js";
import { Product } from "../models/product.js";
import { calculateCartTotal } from "../utils/totalCart.js";

//  Get User's Cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart)
      return res.json({ items: [], totalPrice: 0 });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Get cart failed" });
  }
};
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    //  STOCK CHECK
    if (product.stock < quantity) {
      return res.status(400).json({
        message: `Only ${product.stock} items available`,
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    const price = product.finalPrice;

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [
          {
            product: productId,
            title: product.title,
            quantity,
            price,
            totalItemPrice: quantity * price,
          },
        ],
      });
    } else {
      const item = cart.items.find(
        (i) => i.product.toString() === productId
      );

      if (item) {
        item.quantity += quantity;

        // FIX
        item.totalItemPrice = item.quantity * item.price;
      } else {
        cart.items.push({
          product: productId,
          title: product.title,
          quantity,
          price,
          totalItemPrice: quantity * price,
        });
      }
    }
   //  TOTAL CALCULATOR
    calculateCartTotal(cart);

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: "Add to cart failed",
      error: error.message,
    });
  }
};

// UPDATE CART
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === productId);

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    //  CALCULATOR
    calculateCartTotal(cart);

    await cart.save();
    res.json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Update cart failed", error: error.message });
  }
};

//  Remove Product from Cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);

    //  CALCULATOR
    calculateCartTotal(cart);

    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Remove failed", error: error.message });
  }
};
