import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import configureDNS from "../src/config/dns.js";
import User from "../src/models/User.js";

configureDNS();

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

    const userId = ADMIN_USER_ID.trim().toUpperCase();

    const existingUser = await User.findOne({ userId });

    if (existingUser) {
      console.log(`⚠️ User (${userId}) already exists.`);

      await mongoose.connection.close();
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await User.create({
      userId,
      name: ADMIN_NAME.trim(),
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log(`✅ Admin (${userId}) created successfully.`);

    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Failed to seed admin:");
    console.error(error);

    await mongoose.connection.close().catch(() => {});
    process.exitCode = 1;
  }
};

seedAdmin();
