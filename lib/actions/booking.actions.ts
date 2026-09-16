"use server";
import { connectDB } from "../db";
import { Booking, BookingStatus, IBooking } from "../models/booking";
import { verifyAuth } from "../auth";

const createBooking = async ({
  firstName,
  lastName,
  email,
  phone,
  eventType,
  eventDate,
  guestCount,
  details,
  status,
  createdAt,
}: IBooking) => {
  await connectDB();

  const newBooking = new Booking({
    firstName,
    lastName,
    email,
    phone,
    eventType,
    eventDate,
    guestCount,
    details,
    status,
    createdAt,
  });

  try {
    const savedBooking = await newBooking.save();
    return savedBooking;
  } catch (error) {
    throw new Error(`Error in saving booking: ${error}`);
  }
};

export { createBooking };

function serializeBooking(booking: {
  _id: unknown;
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
}): IBooking {
  return {
    _id: String(booking._id),
    firstName: booking.firstName,
    lastName: booking.lastName,
    email: booking.email,
    phone: booking.phone,
    eventType: booking.eventType,
    eventDate: booking.eventDate,
    guestCount: booking.guestCount,
    details: booking.details,
    status: booking.status,
    createdAt: booking.createdAt,
  };
}

export const getBooking = async () => {
  try {
    const isAdmin = await verifyAuth();
    if (!isAdmin) {
      return [];
    }

    await connectDB();
    const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
    return bookings.map((booking) =>
      serializeBooking(booking as unknown as Parameters<typeof serializeBooking>[0]),
    );
  } catch (error) {
    console.log(`something went wrong`, error);
    return [];
  }
};

export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus,
) => {
  const isAdmin = await verifyAuth();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    return { success: false, error: "Invalid status" };
  }

  try {
    await connectDB();
    const updated = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true },
    ).lean();

    if (!updated) {
      return { success: false, error: "Booking not found" };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to update booking status:", error);
    return { success: false, error: "Failed to update status" };
  }
};
