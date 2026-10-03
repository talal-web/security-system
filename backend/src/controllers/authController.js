import {
  loginService,
  logoutService,
  getMeService,
} from "../services/auth/auth.service.js";

// ======================================
// Login
// ======================================

export const login = async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    const { token, user } = await loginService({
      rawUserId: userId,
      password,
    });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Logout
// ======================================

export const logout = async (req, res, next) => {
  try {
    await logoutService();

    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Get Current User
// ======================================

export const getMe = async (req, res, next) => {
  try {
    const user = await getMeService({
      userId: req.user.id,
    });

    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      Pragma: "no-cache",
      Expires: "0",
    });

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
