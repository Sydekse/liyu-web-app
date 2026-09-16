import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  eventType: { type: String, required: true },
  eventDate: { type: Date, required: true },
  guestCount: { type: Number, required: true },
  details: String,
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

// Fix for "Booking" model initialization
const Booking =
  (mongoose.models?.Booking as mongoose.Model<IBooking>) ||
  mongoose.model("Booking", bookingSchema);

export { Booking };

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface IBooking {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: Date;
  guestCount: number;
  details?: string;
  status: BookingStatus;
  createdAt: Date;
}
