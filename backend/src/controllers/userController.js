import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

import {
  createUserService,
  getUsersService,
  getUserByIdService,
  updateUserService,
  changeUserPasswordService,
  updateUserStatusService,
  deleteUserService,
} from "../services/user/user.service.js";

const validateId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid user ID");
  }
};

/* CREATE USER */

export const createUser = async (req, res) => {
  try {
    const user = await createUserService(req.user, req.body);

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "User ID already exists");
    }
    throw error;
  }
};

/* GET ALL USERS */

export const getUsers = async (req, res) => {
  const users = await getUsersService(req.user);

  return res.status(200).json({
    count: users.length,
    users,
  });
};

/* GET SINGLE USER */

export const getUserById = async (req, res) => {
  validateId(req.params.id);

  const user = await getUserByIdService(req.user, req.params.id);

  return res.status(200).json({ user });
};

/* UPDATE USER */

export const updateUser = async (req, res) => {
  validateId(req.params.id);

  const result = await updateUserService(req.user, req.params.id, req.body);

  return res.status(200).json(result);
};

/* CHANGE PASSWORD */

export const changeUserPassword = async (req, res) => {
  validateId(req.params.id);

  const message = await changeUserPasswordService(
    req.user,
    req.params.id,
    req.body.password,
  );

  return res.status(200).json({ message });
};

/* ACTIVATE / DEACTIVATE */

export const updateUserStatus = async (req, res) => {
  validateId(req.params.id);

  const result = await updateUserStatusService(
    req.user,
    req.params.id,
    req.body.isActive,
  );

  return res.status(200).json(result);
};

/* DELETE USER */

export const deleteUser = async (req, res) => {
  validateId(req.params.id);

  await deleteUserService(req.user, req.params.id);

  return res.status(200).json({
    message: "User deleted successfully",
  });
};
