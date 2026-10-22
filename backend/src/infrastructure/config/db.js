import mongoose from "mongoose";

import configureDNS from "./dns.js";
import logger from "./logger.js";

configureDNS();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    connectTimeoutMS: 10_000,
    serverSelectionTimeoutMS: 10_000,
  });

  logger.info({ message: "MongoDB connected successfully" });
};

export default connectDB;
