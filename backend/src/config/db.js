import dns from "dns";
import mongoose from "mongoose";

if (process.env.USE_CUSTOM_DNS === "true") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
  console.log("🌐 Using custom DNS servers");
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
