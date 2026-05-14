// scripts/seedAdmin.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "../src/models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const existingUser = await User.findOne({
      userId: "ADM001",
    });

    if (existingUser) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.create({
      userId: "ADM001",
      name: "Sufyan Bhatti",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedAdmin();
