import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: String,
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user", "owner"], default: "user" },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", userSchema);
