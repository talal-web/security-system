import express from "express";
import upload from "../config/multer.js";
import logger from "../config/logger.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * POST /api/upload/upload
 * Upload single image to Cloudinary
 */
router.post(
  "/upload",
  authorizeRoles("admin", "developer", "clerk"),
  upload.single("image"),
  async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const result = await uploadToCloudinary(file.buffer);

      return res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        data: {
          url: result.secure_url,
          public_id: result.public_id,
        },
      });
    } catch (error) {
      logger.error({
        message: "Upload error",
        error: error.message,
      });

      return res.status(500).json({
        success: false,
        message: "Server error while uploading file",
      });
    }
  },
);

export default router;
