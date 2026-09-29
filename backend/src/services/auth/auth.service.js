import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../../config/logger.js";
import ApiError from "../../utils/ApiError.js";

// ======================================
// Login
// ======================================

export const loginService = async ({ rawUserId, password }) => {
  try {
    // Validate input
    if (!rawUserId || !password) {
      throw new ApiError(400, "User ID and password are required");
    }

    // Normalize User ID
    const userId = rawUserId.trim().toUpperCase();

    logger.info({
      message: "Login attempt",
      userId,
    });

    // Find user
    const user = await User.findOne({ userId }).select("+password");

    if (!user) {
      logger.warn({
        message: "Login failed: user not found",
        userId,
      });

      throw new ApiError(401, "Invalid credentials");
    }

    // Check if account is active
    if (!user.isActive) {
      logger.warn({
        message: "Login failed: account inactive",
        userId,
      });

      throw new ApiError(
        403,
        "Your account is inactive. Please contact an administrator.",
      );
    }

    // Check password
    if (!user.password) {
      logger.error({
        message: "Login failed: password not configured",
        userId,
      });

      throw new ApiError(500, "User account is incorrectly configured");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.warn({
        message: "Login failed: incorrect password",
        userId,
      });

      throw new ApiError(401, "Invalid credentials");
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      logger.error({
        message: "JWT_SECRET is missing",
      });

      throw new ApiError(500, "Authentication service is not configured");
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

    logger.info({
      message: "Login successful",
      userId,
    });

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        userId: user.userId,
      },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    logger.error({
      message: "Login error",
      error: error.message,
    });

    throw new ApiError(500, "Internal server error");
  }
};

// ======================================
// Logout
// ======================================

export const logoutService = async () => {
  return {
    message: "Logged out successfully",
  };
};

// ======================================
// Get Current User
// ======================================

export const getMeService = async ({ userId }) => {
  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if account was deactivated after login
    if (!user.isActive) {
      logger.warn({
        message: "Authenticated user is inactive",
        userId: user.userId,
      });

      throw new ApiError(
        403,
        "Your account is inactive. Please contact an administrator.",
      );
    }

    return {
      id: user._id.toString(),
      name: user.name,
      role: user.role,
      userId: user.userId,
      areas: Array.isArray(user.areas)
        ? user.areas.map((area) => area.toString())
        : [],
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    logger.error({
      message: "Get current user error",
      error: error.message,
    });

    throw new ApiError(500, "Internal server error");
  }
};
