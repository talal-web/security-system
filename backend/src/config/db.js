import dns from "dns";
import mongoose from "mongoose";

if (process.env.USE_CUSTOM_DNS === "true") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
  console.log("Using custom DNS servers");
}

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    connectTimeoutMS: 10_000,
    serverSelectionTimeoutMS: 10_000,
  });

  console.log("MongoDB connected successfully");
};

export default connectDB;
