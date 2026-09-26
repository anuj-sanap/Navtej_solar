import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVisit extends Document {
  visitorId?: string;
  userId?: mongoose.Types.ObjectId;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  userRole?: string;
  ip: string;
  userAgent: string;
  path: string;
  referrer?: string;
  createdAt: Date;
}

const visitSchema = new Schema<IVisit>({
  visitorId: { type: String, trim: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  userName: { type: String, trim: true },
  userEmail: { type: String, trim: true },
  userPhone: { type: String, trim: true },
  userRole: { type: String, trim: true },
  ip: { type: String, default: "unknown" },
  userAgent: { type: String, default: "unknown" },
  path: { type: String, required: true },
  referrer: { type: String, default: "" },
}, { timestamps: true });

export const Visit: Model<IVisit> = mongoose.models.Visit || mongoose.model<IVisit>("Visit", visitSchema);
