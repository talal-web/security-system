import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import ApiError from "../../utils/ApiError.js";

const MANAGERS = ["developer", "admin"];
const ASSIGNABLE_ROLES = ["admin", "clerk", "supervisor"];

const canManage = (actor) => MANAGERS.includes(actor?.role);
const isSelf = (actor, user) => actor?.id?.toString() === user._id.toString();

const requireManager = (actor, action) => {
  if (!canManage(actor)) {
    throw new ApiError(403, `You are not authorized to ${action}`);
  }
};

const userResponse = (user) => ({
  id: user._id,
  userId: user.userId,
  name: user.name,
  role: user.role,
  areas: Array.isArray(user.areas)
    ? user.areas.map((area) => area.toString())
    : [],
  isActive: user.isActive,
});

const normalizeAreas = (areas) => [
  ...new Set(areas.filter(Boolean).map((area) => area.toString())),
];

const validateName = (name) => {
  if (typeof name !== "string" || !name.trim()) {
    throw new ApiError(400, "Name cannot be empty");
  }
  return name.trim();
};

const findUser = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

/* CREATE USER */

export const createUserService = async (actor, data) => {
  requireManager(actor, "create users");

  const { userId, name, password, role, areas, isActive = true } = data;

  if (!userId || !name || !password || !role) {
    throw new ApiError(400, "userId, name, password and role are required");
  }

  if (role === "developer") {
    throw new ApiError(
      403,
      "Developer accounts can only be created through system setup",
    );
  }

  if (!ASSIGNABLE_ROLES.includes(role)) {
    throw new ApiError(400, "Invalid user role");
  }

  if (typeof isActive !== "boolean") {
    throw new ApiError(400, "isActive must be a boolean");
  }

  if (
    (role === "clerk" || role === "supervisor") &&
    (!Array.isArray(areas) || areas.length === 0)
  ) {
    throw new ApiError(
      400,
      "Clerks and supervisors must have at least one assigned area",
    );
  }

  if (role === "admin" && areas !== undefined) {
    throw new ApiError(
      400,
      "Admin and developer users do not require area assignments",
    );
  }

  const normalizedUserId = userId.trim().toUpperCase();

  const existingUser = await User.findOne({
    userId: normalizedUserId,
  });

  if (existingUser) {
    throw new ApiError(409, "User ID already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const normalizedAreas = role === "admin" ? [] : normalizeAreas(areas || []);

  const user = await User.create({
    userId: normalizedUserId,
    name: validateName(name),
    password: hashedPassword,
    role,
    areas: normalizedAreas,
    isActive,
  });

  return userResponse(user);
};

/* GET ALL USERS */

export const getUsersService = async (actor) => {
  requireManager(actor, "view users");

  return User.aggregate([
    {
      $addFields: {
        activeOrder: { $cond: ["$isActive", 0, 1] },
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
};

/* GET SINGLE USER */

export const getUserByIdService = async (actor, id) => {
  requireManager(actor, "view users");

  const user = await User.findById(id).select("-password");

  if (!user) throw new ApiError(404, "User not found");

  return user;
};

/* UPDATE USER */

export const updateUserService = async (actor, id, data) => {
  requireManager(actor, "update users");

  const { name, role, areas, isActive } = data;
  const user = await findUser(id);

  if (isSelf(actor, user)) {
    if (role !== undefined || isActive !== undefined) {
      throw new ApiError(
        403,
        "You cannot change your own role or account status",
      );
    }

    if (name !== undefined) user.name = validateName(name);

    await user.save();
    return {
      message: "Your profile updated successfully",
      user: userResponse(user),
    };
  }

  if (user.role === "developer") {
    throw new ApiError(403, "Developer account cannot be modified");
  }

  if (name !== undefined) user.name = validateName(name);

  if (role !== undefined) {
    if (!ASSIGNABLE_ROLES.includes(role)) {
      throw new ApiError(400, "Invalid user role");
    }
    user.role = role;
  }

  if (areas !== undefined) {
    if (user.role === "admin" || user.role === "developer") {
      throw new ApiError(
        403,
        "Admin and developer users do not require area assignments",
      );
    }

    if (!Array.isArray(areas) || areas.length === 0) {
      throw new ApiError(
        400,
        "At least one area assignment is required for clerks and supervisors",
      );
    }

    user.areas = normalizeAreas(areas);
  }

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      throw new ApiError(400, "isActive must be a boolean");
    }
    user.isActive = isActive;
  }

  await user.save();

  return {
    message: "User updated successfully",
    user: userResponse(user),
  };
};

/* CHANGE PASSWORD */

export const changeUserPasswordService = async (actor, id, password) => {
  requireManager(actor, "change passwords");

  if (!password) {
    throw new ApiError(400, "New password is required");
  }

  if (typeof password !== "string" || password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  const user = await findUser(id);
  const self = isSelf(actor, user);

  if (!self && user.role === "developer") {
    throw new ApiError(403, "Developer password cannot be changed");
  }

  user.password = await bcrypt.hash(password, 12);
  await user.save();

  return self
    ? "Your password changed successfully"
    : "Password changed successfully";
};

/* ACTIVATE / DEACTIVATE */

export const updateUserStatusService = async (actor, id, isActive) => {
  requireManager(actor, "change user status");

  if (typeof isActive !== "boolean") {
    throw new ApiError(400, "isActive must be a boolean");
  }

  const user = await findUser(id);

  if (isSelf(actor, user)) {
    throw new ApiError(403, "You cannot change your own account status");
  }

  if (user.role === "developer") {
    throw new ApiError(403, "Developer account status cannot be changed");
  }

  user.isActive = isActive;
  await user.save();

  return {
    message: isActive
      ? "User activated successfully"
      : "User deactivated successfully",
    user: userResponse(user),
  };
};

/* DELETE USER */

export const deleteUserService = async (actor, id) => {
  requireManager(actor, "delete users");

  const user = await findUser(id);

  if (isSelf(actor, user)) {
    throw new ApiError(403, "You cannot delete your own account");
  }

  if (user.role === "developer") {
    throw new ApiError(403, "Developer account cannot be deleted");
  }

  await user.deleteOne();
};
