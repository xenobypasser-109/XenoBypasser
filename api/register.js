import mongoose from "mongoose";
import bcrypt from "bcrypt";

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User =
  mongoose.models.User ||
  mongoose.model("User", UserSchema);

export default async function handler(req, res) {

  if (req.method !== "POST")
    return res.status(405).end();

  await connectDB();

  const { username, password } = req.body;

  const existing = await User.findOne({ username });

  if (existing)
    return res.status(409).json({
      message: "IDENTITY_ALREADY_EXISTS"
    });

  const hash = await bcrypt.hash(password, 10);

  await User.create({
    username,
    password: hash
  });

  res.status(201).json({
    message: "IDENTITY_CREATED"
  });
}
