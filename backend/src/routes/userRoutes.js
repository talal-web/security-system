import express from "express";

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  changeUserPassword,
  updateUserStatus,
  deleteUser,
} from "../controllers/userController.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create user
router.post("/", authorizeRoles("developer", "admin"), createUser);

// Get all users
router.get("/", authorizeRoles("developer", "admin"), getUsers);

// Get single user
router.get("/:id", authorizeRoles("developer", "admin"), getUserById);

// Update user
router.patch("/:id", authorizeRoles("developer", "admin"), updateUser);

// Change user password
router.patch(
  "/:id/password",
  authorizeRoles("developer", "admin"),
  changeUserPassword,
);

// Activate / deactivate user
router.patch(
  "/:id/status",
  authorizeRoles("developer", "admin"),
  updateUserStatus,
);

// Delete user
router.delete("/:id", authorizeRoles("developer", "admin"), deleteUser);

export default router;
