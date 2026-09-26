import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  title: string;
  location: string;
  category?: string;
  capacity?: string;
  description?: string;
  imageUrl: string;
  images: string[];
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>({
  title: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  category: { type: String, trim: true, default: "Residential" },
  capacity: { type: String, trim: true, default: "" },
  description: { type: String, trim: true, default: "" },
  imageUrl: { type: String, default: "" },
  images: { type: [String], default: [] },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for backward-compatibility with image_url
projectSchema.virtual("image_url").get(function () {
  return this.imageUrl;
});

export const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);
