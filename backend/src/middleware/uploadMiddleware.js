// middleware/uploadMiddleware.js

import multer from "multer";

// Store file in memory (RAM)
const storage = multer.memoryStorage();

// File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|webp/;

  const extname = allowedTypes.test(
    file.originalname.split(".").pop().toLowerCase(),
  );

  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;
