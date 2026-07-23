import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import configureDNS from "../src/config/dns.js";
import User from "../src/models/User.js";

configureDNS();

const { MONGO_URI, DEVELOPER_USER_ID, DEVELOPER_NAME, DEVELOPER_PASSWORD } =
  process.env;

const seedDeveloper = async () => {
  try {
    if (
      !MONGO_URI ||
      !DEVELOPER_USER_ID ||
      !DEVELOPER_NAME ||
      !DEVELOPER_PASSWORD
    ) {
      throw new Error(
        "Missing required environment variables: MONGO_URI, DEVELOPER_USER_ID, DEVELOPER_NAME, DEVELOPER_PASSWORD.",
      );
    }

    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB Connected");

    const existingUser = await User.findOne({
      userId: DEVELOPER_USER_ID,
    });

    if (existingUser) {
      console.log(`⚠️ Developer (${DEVELOPER_USER_ID}) already exists.`);

      await mongoose.connection.close();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(DEVELOPER_PASSWORD, 10);

    await User.create({
      userId: DEVELOPER_USER_ID,
      name: DEVELOPER_NAME,
      password: hashedPassword,
      role: "developer",
    });

    console.log("✅ Developer created successfully.");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed developer:");
    console.error(error);

    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
};

seedDeveloper();
