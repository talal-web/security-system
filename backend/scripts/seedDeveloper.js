// scripts/seedDeveloper.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "../src/models/User.js";

dotenv.config();

const seedDeveloper = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const existingUser = await User.findOne({
      userId: "DEV001",
    });

    if (existingUser) {
      console.log("Developer already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.create({
      userId: "DEV001",
      name: "Talal Malik",
      password: hashedPassword,
      role: "developer",
    });

    console.log("Developer created successfully");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedDeveloper();
