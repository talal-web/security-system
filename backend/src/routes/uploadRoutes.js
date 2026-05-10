import express from "express";
import upload from "../config/multer.js";

const router = express.Router();

/**
 * POST /api/upload
 * Upload single image to Cloudinary
 */
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    // multer-storage-cloudinary automatically uploads file
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: file.path, // Cloudinary URL
        public_id: file.filename, // Cloudinary ID (useful for delete/update)
      },
    });
  } catch (error) {
    console.error("Upload Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while uploading file",
    });
  }
});

export default router;
