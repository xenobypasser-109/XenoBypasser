import mongoose from "mongoose";
import bcrypt from "bcrypt";

const allowedOrigin = "https://xeno-bypass.vercel.app";

let isConnected = false;

// Reusable DB connection
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

// User schema
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default async function handler(req, res) {
  // --- CORS headers ---
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "METHOD_NOT_ALLOWED" });
  }

  await connectDB();

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "MISSING_FIELDS" });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: "AUTHENTICATION_FAILED" });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(401).json({ message: "AUTHENTICATION_FAILED" });
  }

  res.status(200).json({ message: "ACCESS_GRANTED" });
}
