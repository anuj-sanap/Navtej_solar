import mongoose, { Schema } from "mongoose";

const leadSchema = new Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  location: { type: String, required: true, trim: true },
  plotSize: Number,
  electricityBill: Number,
  source: { type: String, default: "website" },
  status: { type: String, enum: ["new", "contacted", "qualified", "closed"], default: "new" },
  message: String,
}, { timestamps: true });

export const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);
