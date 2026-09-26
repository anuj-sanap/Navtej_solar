import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  passwordHash: string;
  role: "user" | "owner";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user", "owner"], default: "user" },
}, { timestamps: true });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
