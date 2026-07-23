import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import configureDNS from "../src/config/dns.js";
import User from "../src/models/User.js";

configureDNS();

const { MONGO_URI, SUPERVISOR_USER_ID, SUPERVISOR_NAME, SUPERVISOR_PASSWORD } =
  process.env;

const seedSupervisor = async () => {
  try {
    if (
      !MONGO_URI ||
      !SUPERVISOR_USER_ID ||
      !SUPERVISOR_NAME ||
      !SUPERVISOR_PASSWORD
    ) {
      throw new Error(
        "Missing required environment variables: MONGO_URI, SUPERVISOR_USER_ID, SUPERVISOR_NAME, SUPERVISOR_PASSWORD.",
      );
    }

    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB Connected");

    const existingUser = await User.findOne({
      userId: SUPERVISOR_USER_ID,
    });

    if (existingUser) {
      console.log(`⚠️ Supervisor (${SUPERVISOR_USER_ID}) already exists.`);

      await mongoose.connection.close();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(SUPERVISOR_PASSWORD, 10);

    await User.create({
      userId: SUPERVISOR_USER_ID,
      name: SUPERVISOR_NAME,
      password: hashedPassword,
      role: "supervisor",
    });

    console.log("✅ Supervisor created successfully.");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed supervisor:");
    console.error(error);

    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
};

seedSupervisor();
