// import { Product } from "../models/product.js";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// // ES Module __dirname fix
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// /* =====================================================
//    CREATE PRODUCT*/

// export const createProductAdmin = async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "At least one image is required",
//       });
//     }

//     const images = req.files.map((file) =>
//       file.path.replace(/\\/g, "/")
//     );

//     const product = await Product.create({
//       ...req.body,
//       images,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       product,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Product creation failed",
//       error: error.message,
//     });
//   }
// };


// /* =====================================================
//    UPDATE PRODUCT */


// export const updateProductAdmin = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product)
//       return res.status(404).json({ message: "Product not found" });

//     // new images uploaded → delete old ones
//     if (req.files && req.files.length > 0) {
//       product.images.forEach((imgPath) => {
//         const fullPath = path.join(__dirname, "..", imgPath);

//         if (fs.existsSync(fullPath)) {
//           fs.unlinkSync(fullPath);
//           console.log("Old image deleted:", fullPath);
//         }
//       });

//       product.images = req.files.map((file) =>
//         file.path.replace(/\\/g, "/")
//       );
//     }

//     Object.assign(product, req.body);
//     await product.save();

//     res.json({
//       success: true,
//       message: "Product updated successfully",
//       product,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Product update failed",
//       error: error.message,
//     });
//   }
// };


// /* =====================================================
//    DELETE PRODUCT  */


// export const deleteProductAdmin = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     //DELETE IMAGES
//     if (product.images && product.images.length > 0) {
//       for (let imgPath of product.images) {
//         const fullPath = path.join(__dirname, "..", imgPath);

//         if (fs.existsSync(fullPath)) {
//           fs.unlinkSync(fullPath);
//           console.log("Deleted image:", fullPath);

//           //  CHECK & DELETE EMPTY BRAND FOLDER
//           const brandFolder = path.dirname(fullPath);
//           if (fs.existsSync(brandFolder) &&
//               fs.readdirSync(brandFolder).length === 0) {
//             fs.rmdirSync(brandFolder);
//             console.log("Deleted empty brand folder:", brandFolder);

//             //  CHECK & DELETE EMPTY CATEGORY FOLDER
//             const categoryFolder = path.dirname(brandFolder);
//             if (fs.existsSync(categoryFolder) &&
//                 fs.readdirSync(categoryFolder).length === 0) {
//               fs.rmdirSync(categoryFolder);
//               console.log("Deleted empty category folder:", categoryFolder);
//             }
//           }
//         }
//       }
//     }

//     await product.deleteOne();

//     res.status(200).json({
//       success: true,
//       message: "Product, images, and empty folders deleted successfully",
//     });

//   } catch (error) {
//     console.error("Delete Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Delete failed",
//       error: error.message,
//     });
//   }
// };