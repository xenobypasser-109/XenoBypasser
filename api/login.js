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

  const user = await User.findOne({ username });

  if (!user)
    return res.status(401).json({
      message: "AUTHENTICATION_FAILED"
    });

  const valid = await bcrypt.compare(
    password,
    user.password
  );

  if (!valid)
    return res.status(401).json({
      message: "AUTHENTICATION_FAILED"
    });

  res.status(200).json({
    message: "ACCESS_GRANTED"
  });
}
