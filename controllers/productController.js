import { Product } from "../models/product.js";

// -------- GET ALL PRODUCTS WITH SEARCH & CATEGORY -------- //
export const getProduct = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (category) query.category = category;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(query);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Could not fetch products",
    });
  }
};

// -------- GET SINGLE PRODUCT BY ID -------- //
export const productById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching single product:", error);
    res.status(500).json({
      success: false,
      message: "Could not fetch product",
    });
  }
};

// -------- CREATE PRODUCT -------- //
export const createProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const imagePaths = req.files.map((file) => file.path);

    const product = await Product.create({
      title: req.body.title,
      category: req.body.category,
      brand: req.body.brand,
      price: req.body.price,
      oldPrice: req.body.oldPrice,
      discount: req.body.discount,
      storage: req.body.storage,
      features: req.body.features
        ? req.body.features.split(",").map((f) => f.trim())
        : [],
      images: imagePaths,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Product creation failed:", error);
    res.status(500).json({
      success: false,
      message: "Product creation failed",
      error: error.message,
    });
  }
};

// -------- UPDATE PRODUCT BY PUT -------- //
export const putProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      overwrite: false, // safer, overwrite false
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("PUT product failed:", error);
    res.status(500).json({
      success: false,
      message: "Product update failed",
      error: error.message,
    });
  }
};

// -------- UPDATE PRODUCT BY PATCH -------- //
export const patchProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product patched successfully",
      product,
    });
  } catch (error) {
    console.error("PATCH product failed:", error);
    res.status(500).json({
      success: false,
      message: "Product patch failed",
      error: error.message,
    });
  }
};

// -------- DELETE PRODUCT -------- //
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.error("DELETE product failed:", error);
    res.status(500).json({
      success: false,
      message: "Product deletion failed",
      error: error.message,
    });
  }
};
