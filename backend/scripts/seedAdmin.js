import dns from "dns";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "../src/models/User.js";

dotenv.config();

// Temporary workaround for local DNS issue
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const { MONGO_URI, ADMIN_USER_ID, ADMIN_NAME, ADMIN_PASSWORD } = process.env;

const seedAdmin = async () => {
  try {
    if (!MONGO_URI || !ADMIN_USER_ID || !ADMIN_NAME || !ADMIN_PASSWORD) {
      throw new Error(
        "Missing required environment variables: MONGO_URI, ADMIN_USER_ID, ADMIN_NAME, ADMIN_PASSWORD.",
      );
    }

    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB Connected");

    const existingUser = await User.findOne({
      userId: ADMIN_USER_ID,
    });

    if (existingUser) {
      console.log(`⚠️ Admin (${ADMIN_USER_ID}) already exists.`);

      await mongoose.connection.close();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await User.create({
      userId: ADMIN_USER_ID,
      name: ADMIN_NAME,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin created successfully.");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed admin:");
    console.error(error);

    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
};

seedAdmin();
