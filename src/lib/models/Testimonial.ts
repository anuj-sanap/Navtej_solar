import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  quote: string;
  location?: string;
  rating?: number;
  serviceType?: string;
  source?: "admin" | "customer";
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true },
    quote: { type: String, required: true, trim: true },
    location: { type: String, trim: true, default: "" },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    serviceType: {
      type: String,
      trim: true,
      default: "Solar Rooftop Installation",
    },
    source: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", testimonialSchema);
