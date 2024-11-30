import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    lastOtp: { type: String, required: true},
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    socketId: { type: String, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;