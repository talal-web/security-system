// controllers/authController.js

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

export const login = async (req, res) => {
  try {
    const { userId: rawUserId, password } = req.body;

    // Validate input
    if (!rawUserId || !password) {
      return res.status(400).json({
        success: false,
        message: "User ID and password are required",
      });
    }

    // Normalize User ID
    const userId = rawUserId.trim().toUpperCase();

    logger.info({ message: "Login attempt", userId });

    // Find user
    const user = await User.findOne({ userId });

    if (!user) {
      logger.warn({ message: "Login failed: user not found", userId });

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    if (!user.password) {
      logger.error({
        message: "Login failed: password not configured",
        userId,
      });

      return res.status(500).json({
        success: false,
        message: "User account is incorrectly configured",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.warn({ message: "Login failed: incorrect password", userId });

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      logger.error({ message: "JWT_SECRET is missing" });

      return res.status(500).json({
        success: false,
        message: "Authentication service is not configured",
      });
    }

    // Create token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        userId: user.userId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    // Cookie settings
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    logger.info({ message: "Login successful", userId });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        userId: user.userId,
      },
    });
  } catch (error) {
    logger.error({ message: "Login error", error: error.message });

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      Pragma: "no-cache",
      Expires: "0",
    });

    res.status(200).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        role: user.role,
        userId: user.userId,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
