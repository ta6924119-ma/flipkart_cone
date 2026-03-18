import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { category, brand } = req.body;

    if (!category || !brand) {
      return cb(new Error("Category and Brand required"));
    }

    const uploadPath = path.join(
      "uploads",
      category.toLowerCase(),
      brand.toLowerCase()
    );

    // folder create if not exist
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });
