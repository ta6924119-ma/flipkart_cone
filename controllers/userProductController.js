import { Product } from "../models/product.js";

// GET ALL PRODUCTS (User)
export const getAllProducts = async (req, res) => {
  let { search, category, brand, minPrice, maxPrice, sortBy, page = 1, limit = 100} = req.query;
  const query = {};

  if (search) query.title = { $regex: search, $options: "i" };
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (minPrice || maxPrice) query.finalPrice = {};
  if (minPrice) query.finalPrice.$gte = Number(minPrice);
  if (maxPrice) query.finalPrice.$lte = Number(maxPrice);

  let sort = {};
  switch (sortBy) {
    case "price_asc": sort.finalPrice = 1; break;
    case "price_desc": sort.finalPrice = -1; break;
    case "newest": sort.createdAt = -1; break;
    case "popular": sort.reviewsCount = -1; break;
    default: sort.createdAt = -1;
  }

  const total = await Product.countDocuments(query);
  const products = await Product.find(query).sort(sort).skip((page-1)*limit).limit(Number(limit));

  res.json({ success: true, total, page: Number(page), limit: Number(limit), products });
};

// GET SINGLE PRODUCT (User)
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  res.json({ success: true, product });
};
