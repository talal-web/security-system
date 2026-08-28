import bcrypt from "bcryptjs";
import User from "../models/User.js";

const USER_MANAGERS = ["developer", "admin"];

/**
 * Check whether the authenticated user can manage users.
 */
const canManageUsers = (req) => {
  return USER_MANAGERS.includes(req.user?.role);
};

/**
 * Check whether the authenticated user is modifying themselves.
 */
const isSelf = (req, user) => {
  return req.user?.id?.toString() === user._id.toString();
};

/**
 * Return standard user response object.
 */
const userResponse = (user) => ({
  id: user._id,
  userId: user.userId,
  name: user.name,
  role: user.role,
  isActive: user.isActive,
});

/* =========================================================
   CREATE USER
   Developer role can ONLY be created through seed/setup.
========================================================= */

export const createUser = async (req, res) => {
  try {
    const { userId, name, password, role, isActive = true } = req.body;

    if (!canManageUsers(req)) {
      return res.status(403).json({
        message: "You are not authorized to create users",
      });
    }

    if (!userId || !name || !password || !role) {
      return res.status(400).json({
        message: "userId, name, password and role are required",
      });
    }

    // Developer accounts are created only through seed/setup.
    if (role === "developer") {
      return res.status(403).json({
        message: "Developer accounts can only be created through system setup",
      });
    }

    if (!["admin", "clerk", "supervisor"].includes(role)) {
      return res.status(400).json({
        message: "Invalid user role",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive must be a boolean",
      });
    }

    const normalizedUserId = userId.trim().toUpperCase();

    const existingUser = await User.findOne({
      userId: normalizedUserId,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User ID already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      userId: normalizedUserId,
      name: name.trim(),
      password: hashedPassword,
      role,
      isActive,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: userResponse(user),
    });
  } catch (error) {
    console.error("Create user error:", error);

    return res.status(500).json({
      message: "Failed to create user",
    });
  }
};

/* =========================================================
   GET ALL USERS
========================================================= */

export const getUsers = async (req, res) => {
  try {
    if (!canManageUsers(req)) {
      return res.status(403).json({
        message: "You are not authorized to view users",
      });
    }

    const users = await User.aggregate([
      {
        $addFields: {
          activeOrder: {
            $cond: ["$isActive", 0, 1],
          },

          roleOrder: {
            $indexOfArray: [
              ["developer", "admin", "clerk", "supervisor"],
              "$role",
            ],
          },
        },
      },

      {
        $sort: {
          activeOrder: 1,
          roleOrder: 1,
          createdAt: 1,
        },
      },

      {
        $project: {
          password: 0,
          activeOrder: 0,
          roleOrder: 0,
        },
      },
    ]);

    return res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

/* =========================================================
   GET SINGLE USER
========================================================= */

export const getUserById = async (req, res) => {
  try {
    if (!canManageUsers(req)) {
      return res.status(403).json({
        message: "You are not authorized to view users",
      });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    return res.status(500).json({
      message: "Failed to fetch user",
    });
  }
};

/* =========================================================
   UPDATE USER
========================================================= */

export const updateUser = async (req, res) => {
  try {
    const { name, role, isActive } = req.body;

    if (!canManageUsers(req)) {
      return res.status(403).json({
        message: "You are not authorized to update users",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const self = isSelf(req, user);

    /* -------------------------------------------------------
       SELF UPDATE

       Admin/developer can update their own name.

       They CANNOT change:
       - role
       - status
    ------------------------------------------------------- */

    if (self) {
      if (role !== undefined || isActive !== undefined) {
        return res.status(403).json({
          message: "You cannot change your own role or account status",
        });
      }

      if (name !== undefined) {
        if (typeof name !== "string" || !name.trim()) {
          return res.status(400).json({
            message: "Name cannot be empty",
          });
        }

        user.name = name.trim();
      }

      await user.save();

      return res.status(200).json({
        message: "Your profile updated successfully",
        user: userResponse(user),
      });
    }

    /* -------------------------------------------------------
       OTHER DEVELOPER

       Developer accounts are completely protected.
    ------------------------------------------------------- */

    if (user.role === "developer") {
      return res.status(403).json({
        message: "Developer account cannot be modified",
      });
    }

    /* -------------------------------------------------------
       UPDATE ANOTHER USER

       Developer/admin can update:
       - name
       - role
       - status
    ------------------------------------------------------- */

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          message: "Name cannot be empty",
        });
      }

      user.name = name.trim();
    }

    if (role !== undefined) {
      if (!["admin", "clerk", "supervisor"].includes(role)) {
        return res.status(400).json({
          message: "Invalid user role",
        });
      }

      // Developer role cannot be assigned through normal API.
      if (role === "developer") {
        return res.status(403).json({
          message: "Developer role cannot be assigned",
        });
      }

      user.role = role;
    }

    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          message: "isActive must be a boolean",
        });
      }

      user.isActive = isActive;
    }

    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      user: userResponse(user),
    });
  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      message: "Failed to update user",
    });
  }
};

/* =========================================================
   CHANGE USER PASSWORD
========================================================= */

export const changeUserPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!canManageUsers(req)) {
      return res.status(403).json({
        message: "You are not authorized to change passwords",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "New password is required",
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const self = isSelf(req, user);

    /* -------------------------------------------------------
       OWN PASSWORD

       Admin/developer can change their own password.
    ------------------------------------------------------- */

    if (self) {
      user.password = await bcrypt.hash(password, 12);

      await user.save();

      return res.status(200).json({
        message: "Your password changed successfully",
      });
    }

    /* -------------------------------------------------------
       OTHER DEVELOPER

       Developer accounts are protected.
    ------------------------------------------------------- */

    if (user.role === "developer") {
      return res.status(403).json({
        message: "Developer password cannot be changed",
      });
    }

    /* -------------------------------------------------------
       OTHER USERS

       Admin/developer can change their password.
    ------------------------------------------------------- */

    user.password = await bcrypt.hash(password, 12);

    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change user password error:", error);

    return res.status(500).json({
      message: "Failed to change user password",
    });
  }
};

/* =========================================================
   ACTIVATE / DEACTIVATE USER
========================================================= */

export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (!canManageUsers(req)) {
      return res.status(403).json({
        message: "You are not authorized to change user status",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive must be a boolean",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    /* -------------------------------------------------------
       NEVER allow changing your own status.
    ------------------------------------------------------- */

    if (isSelf(req, user)) {
      return res.status(403).json({
        message: "You cannot change your own account status",
      });
    }

    /* -------------------------------------------------------
       DEVELOPER ACCOUNT IS PERMANENTLY PROTECTED.
    ------------------------------------------------------- */

    if (user.role === "developer") {
      return res.status(403).json({
        message: "Developer account status cannot be changed",
      });
    }

    user.isActive = isActive;

    await user.save();

    return res.status(200).json({
      message: isActive
        ? "User activated successfully"
        : "User deactivated successfully",

      user: userResponse(user),
    });
  } catch (error) {
    console.error("Update user status error:", error);

    return res.status(500).json({
      message: "Failed to update user status",
    });
  }
};

/* =========================================================
   DELETE USER
========================================================= */

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "User id is required",
      });
    }

    if (!canManageUsers(req)) {
      return res.status(403).json({
        message: "You are not authorized to delete users",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    /* -------------------------------------------------------
       NEVER allow deleting yourself.
    ------------------------------------------------------- */

    if (isSelf(req, user)) {
      return res.status(403).json({
        message: "You cannot delete your own account",
      });
    }

    /* -------------------------------------------------------
       DEVELOPER ACCOUNT IS PERMANENTLY PROTECTED.
    ------------------------------------------------------- */

    if (user.role === "developer") {
      return res.status(403).json({
        message: "Developer account cannot be deleted",
      });
    }

    await user.deleteOne();

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      message: "Failed to delete user",
    });
  }
};
