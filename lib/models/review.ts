import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  email: { type: String },
  eventType: { type: String },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  token: { type: String, required: true, unique: true, index: true },
  status: {
    type: String,
    enum: ["pending", "submitted", "cancelled"],
    default: "pending",
  },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
  published: { type: Boolean, default: false },
  source: {
    type: String,
    enum: ["invite", "open"],
    default: "invite",
  },
  submittedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const Review =
  (mongoose.models?.Review as mongoose.Model<IReview>) ||
  mongoose.model("Review", reviewSchema);

export { Review };

export type ReviewStatus = "pending" | "submitted" | "cancelled";
export type ReviewSource = "invite" | "open";

export interface IReview {
  _id?: string;
  guestName: string;
  email?: string;
  eventType?: string;
  bookingId?: string;
  token: string;
  status: ReviewStatus;
  rating?: number;
  comment?: string;
  published: boolean;
  source: ReviewSource;
  submittedAt?: Date;
  createdAt: Date;
}
