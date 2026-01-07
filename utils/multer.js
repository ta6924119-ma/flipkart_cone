import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.body.category; // frontend/postman se
    cb(null, `uploads/${category}`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

 export const upload = multer({ storage });


