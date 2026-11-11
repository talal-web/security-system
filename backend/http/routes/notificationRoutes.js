// backend/http/routes/notificationRoutes.js
//
// Each user sees only notifications addressed to their own role.

import express from "express";

import {
  getNotifications,
  readNotification,
  readAllNotifications,
} from "../controllers/notificationController.js";

import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(authorizeRoles("developer", "admin"));

router.get("/", getNotifications);
router.patch("/read-all", readAllNotifications);
router.patch("/:id/read", readNotification);

export default router;
