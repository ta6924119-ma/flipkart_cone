import { SuperAdmin } from "../models/superAdmin.js";
import { Admin } from "../models/admin.js";
import { generateToken } from "../utils/jwt.js";


import { Cart } from "../models/cart.js";
import { Order } from "../models/order.js";
import { User } from "../models/user.js";
import { Wishlist } from "../models/wishlist.js";
import { DeliveryBoy } from "../models/deliveryboy.js";


import { Product } from "../models/product.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// LOGIN
export const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await SuperAdmin.findOne({ email }).select("+password");

    if (!admin)
      return res.status(404).json({ message: "SuperAdmin not found" });

    const isMatch = await admin.comparePassword(password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    const token = generateToken(admin._id);

    admin.tokens.push(token);
    await admin.save();

    res.json({
      success: true,
      token
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE ADMIN
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exist = await Admin.findOne({ email });

    if (exist)
      return res.status(400).json({ message: "Admin already exists" });

    const admin = await Admin.create({ name, email, password });

    res.json({ success: true, admin });

  } catch (error) {
    console.error("Create Admin Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// get all admins

export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();

    res.json({
      success: true,
      count: admins.length,
      admins
    });

  } catch (error) {
    console.error("Get Admins Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// BLOCK ADMIN
export const blockAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin)
      return res.status(404).json({ message: "Admin not found" });

    admin.isBlocked = true;
    await admin.save();

    res.json({
      success: true,
      message: `${admin.email} has been blocked`
    });

  } catch (error) {
    console.error("Block Admin Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




// UPDATE ADMIN
export const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin)
      return res.status(404).json({ message: "Admin not found" });

    Object.assign(admin, req.body);
    await admin.save();

    res.json({ success: true, admin });

  } catch (error) {
    console.error("Update Admin Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// DELETE ADMIN
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin)
      return res.status(404).json({ message: "Admin not found" });

    await admin.deleteOne();

    res.json({ success: true, message: "Admin deleted" });

  } catch (error) {
    console.error("Delete Admin Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ES Module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =====================================================
   CREATE PRODUCT*/

export const createProductSuperAdmin = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const images = req.files.map((file) =>
      file.path.replace(/\\/g, "/")
    );

    const product = await Product.create({
      ...req.body,
      images,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product creation failed",
      error: error.message,
    });
  }
};


/* =====================================================
   UPDATE PRODUCT */


export const updateProductSuperAdmin = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // new images uploaded → delete old ones
    if (req.files && req.files.length > 0) {
      product.images.forEach((imgPath) => {
        const fullPath = path.join(__dirname, "..", imgPath);

        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log("Old image deleted:", fullPath);
        }
      });

      product.images = req.files.map((file) =>
        file.path.replace(/\\/g, "/")
      );
    }

    Object.assign(product, req.body);
    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product update failed",
      error: error.message,
    });
  }
};


/* =====================================================
   DELETE PRODUCT  */


export const deleteProductSuperAdmin = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    //DELETE IMAGES
    if (product.images && product.images.length > 0) {
      for (let imgPath of product.images) {
        const fullPath = path.join(__dirname, "..", imgPath);

        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log("Deleted image:", fullPath);

          //  CHECK & DELETE EMPTY BRAND FOLDER
          const brandFolder = path.dirname(fullPath);
          if (fs.existsSync(brandFolder) &&
              fs.readdirSync(brandFolder).length === 0) {
            fs.rmdirSync(brandFolder);
            console.log("Deleted empty brand folder:", brandFolder);

            //  CHECK & DELETE EMPTY CATEGORY FOLDER
            const categoryFolder = path.dirname(brandFolder);
            if (fs.existsSync(categoryFolder) &&
                fs.readdirSync(categoryFolder).length === 0) {
              fs.rmdirSync(categoryFolder);
              console.log("Deleted empty category folder:", categoryFolder);
            }
          }
        }
      }
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product, images, and empty folders deleted successfully",
    });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message,
    });
  }
};


// GET ALL PRODUCTS superadmin
export const getAllProductsSuperAdmin = async (req, res) => {
  try {
    let { search, category, brand, minPrice, maxPrice, sortBy, page = 1, limit = 100 } = req.query;
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

    const products = await Product.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      products
    });

  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({
       success: false, 
       message: "Internal server error" 
      });
  }
};

// GET SINGLE PRODUCT 
export const getSuperAdminProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ 
    success: false,
     message: "Product not found"
     });

    res.json({ success: true, product });

  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({
      success: false, 
      message: "Internal server error" });
  }
};




export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalDeliveryBoys = await DeliveryBoy.countDocuments();
    const totalWishlists = await Wishlist.countDocuments();
    const totalCarts = await Cart.countDocuments();

    const revenue = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalDeliveryBoys,
        totalCarts,
        totalWishlists,
        totalRevenue: revenue[0]?.totalRevenue || 0
      }
    });



    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getRecentOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: "user",
                select: "name email"
            })
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error("Recent Orders Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

//get top products
export const getTopProducts = async (req, res) => {
    try {
const topProducts = await Order.aggregate([
  { $unwind: "$items" },
  { $group: { _id: "$items.product", count: { $sum: "$items.quantity" } } },
  { $sort: { count: -1 } },
  { $limit: 10 },
  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "productDetails"
    }
  },
  { $unwind: "$productDetails" },
  {
    $project: {
      _id: 1,
      count: 1,
      title: "$productDetails.title",
      price: "$productDetails.price",
      images: "$productDetails.images"
    }
  }
]);
        res.status(200).json({ success: true, topProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//get low stock products
export const getLowStockProducts = async (req, res) => {
    try {
        const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).sort({ stock: 1 });
        res.status(200).json({ success: true, lowStockProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//get monthly revenue
export const getMonthlyRevenue = async (req, res) => {
    try {
        const monthlyRevenue = await Order.aggregate([
            { $match: { paymentStatus: "paid" } },
            { $group: { _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, totalRevenue: { $sum: "$totalAmount" } } },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
            { $limit: 12 }
        ]);
        res.status(200).json({ success: true, monthlyRevenue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//get all users
export const getAllUsers = async (req, res) => {
  try {

    const users = await User.find()
      .select("_id name email address phone")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      totalUsers: users.length,
      users
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
};

//block user
export const blockUser = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "SuperAdmin not found "
      });
    }

    user.isBlocked = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: `${user.email} has been blocked`
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Internal server error"
    });
  }

};

//get user details


export const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1️ Fetch user basic info
    const user = await User.findById(userId)
      .select("_id name email ");

    if (!user) {
      return res.status(404).json({ success: false, message: "SuperAdmin not found " });
    }

    //  Fetch all orders by this user
    const orders = await Order.find({ user: userId }).populate({
      path: "items.product",
      select: "title price images ",
    });

    // Calculate order stats
    let totalOrders = orders.length;
    let totalAmount = 0;
    let productsOrdered = [];

    orders.forEach((order) => {
      totalAmount += order.totalAmount || 0;

      order.items.forEach((item) => {
        // Check if product already counted
        const existing = productsOrdered.find(p => String(p.product._id) === String(item.product._id));
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          productsOrdered.push({
            product: item.product,
            quantity: item.quantity
          });
        }
      });
    });

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        
      },
      orderStats: {
        totalOrders,
        totalAmount,
        productsOrdered
      }
    });

  } catch (error) {
    console.error("Get User Details Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};