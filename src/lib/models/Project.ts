import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema({
  title: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  capacity: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  images: [String],
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
