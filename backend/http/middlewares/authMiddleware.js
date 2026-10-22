import jwt from "jsonwebtoken";
import User from "../../src/models/User.js";
import ApiError from "../../src/utils/ApiError.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(new ApiError(401, "Unauthorized"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id)
      .select("role userId isActive areas")
      .lean();

    if (!user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    if (!user.isActive) {
      return next(new ApiError(403, "Your account is inactive"));
    }

    req.user = {
      id: decoded.id,
      role: user.role,
      userId: user.userId,
      areas: Array.isArray(user.areas) ? user.areas.map(String) : [],
    };

    next();
  } catch (error) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return next(new ApiError(401, "Invalid token"));
  }
};
