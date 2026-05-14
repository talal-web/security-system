// scripts/seedSupervisors.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "../src/models/User.js";

dotenv.config();

const seedSupervisors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const supervisors = [
      {
        userId: "SUP001",
        name: "Supervisor 1",
      },

      {
        userId: "SUP002",
        name: "Supervisor 2",
      },

      {
        userId: "SUP003",
        name: "Supervisor 3",
      },

      {
        userId: "SUP004",
        name: "Supervisor 4",
      },

      {
        userId: "SUP005",
        name: "Supervisor 5",
      },

      {
        userId: "SUP006",
        name: "Supervisor 6",
      },

      {
        userId: "SUP007",
        name: "Supervisor 7",
      },

      {
        userId: "SUP008",
        name: "Supervisor 8",
      },
    ];

    const hashedPassword = await bcrypt.hash("123456", 10);

    for (const supervisor of supervisors) {
      const existingUser = await User.findOne({
        userId: supervisor.userId,
      });

      if (existingUser) {
        console.log(`${supervisor.userId} already exists`);
        continue;
      }

      await User.create({
        userId: supervisor.userId,
        name: supervisor.name,
        password: hashedPassword,
        role: "supervisor",
      });

      console.log(`${supervisor.userId} created`);
    }

    console.log("All supervisors seeded successfully");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedSupervisors();
