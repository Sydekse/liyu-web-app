"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { connectDB } from "../db";
import { verifyAuth } from "../auth";
import { Booking } from "../models/booking";
import { IReview, Review, ReviewStatus } from "../models/review";

export type ReviewInvite = {
  id: string;
  guestName: string;
  email: string;
  eventType: string;
  bookingId: string;
  token: string;
  status: ReviewStatus;
  rating: number | null;
  comment: string;
  published: boolean;
  submittedAt: string | null;
  createdAt: string;
};

export type PublicReview = {
  id: string;
  guestName: string;
  eventType: string;
  rating: number;
  comment: string;
  submittedAt: string | null;
};

function serializeReview(review: IReview & { _id: unknown }): ReviewInvite {
  return {
    id: String(review._id),
    guestName: review.guestName,
    email: review.email ?? "",
    eventType: review.eventType ?? "",
    bookingId: review.bookingId ? String(review.bookingId) : "",
    token: review.token,
    status: review.status,
    rating: review.rating ?? null,
    comment: review.comment ?? "",
    published: review.published,
    submittedAt: review.submittedAt
      ? new Date(review.submittedAt).toISOString()
      : null,
    createdAt: new Date(review.createdAt).toISOString(),
  };
}

function createToken() {
  return randomBytes(24).toString("hex");
}

export async function getAdminReviews() {
  const isAdmin = await verifyAuth();
  if (!isAdmin) {
    return [];
  }

  try {
    await connectDB();
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    return reviews.map((review) =>
      serializeReview(review as unknown as IReview & { _id: unknown }),
    );
  } catch (error) {
    console.error("Failed to load admin reviews:", error);
    return [];
  }
}

export async function inviteReviewFromBooking(bookingId: string) {
  const isAdmin = await verifyAuth();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  if (!bookingId) {
    return { success: false, error: "Booking is required" };
  }

  try {
    await connectDB();
    const booking = await Booking.findById(bookingId).lean();
    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    const existing = await Review.findOne({
      bookingId,
      status: { $in: ["pending", "submitted"] },
    }).lean();

    if (existing) {
      return {
        success: true,
        alreadyExists: true,
        review: serializeReview(existing as unknown as IReview & { _id: unknown }),
      };
    }

    const created = await Review.create({
      guestName: `${booking.firstName} ${booking.lastName}`.trim(),
      email: booking.email,
      eventType: booking.eventType,
      bookingId: booking._id,
      token: createToken(),
      status: "pending",
      published: false,
    });

    return {
      success: true,
      alreadyExists: false,
      review: serializeReview(created.toObject() as IReview & { _id: unknown }),
    };
  } catch (error) {
    console.error("Failed to invite review:", error);
    return { success: false, error: "Failed to create review invite" };
  }
}

export async function inviteCustomReview(input: {
  guestName: string;
  email?: string;
  eventType?: string;
}) {
  const isAdmin = await verifyAuth();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  const guestName = input.guestName?.trim();
  if (!guestName) {
    return { success: false, error: "Guest name is required" };
  }

  try {
    await connectDB();
    const created = await Review.create({
      guestName,
      email: input.email?.trim() || undefined,
      eventType: input.eventType?.trim() || undefined,
      token: createToken(),
      status: "pending",
      published: false,
    });

    return {
      success: true,
      review: serializeReview(created.toObject() as IReview & { _id: unknown }),
    };
  } catch (error) {
    console.error("Failed to create custom review invite:", error);
    return { success: false, error: "Failed to create review invite" };
  }
}

export async function cancelReviewInvite(reviewId: string) {
  const isAdmin = await verifyAuth();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await connectDB();
    const review = await Review.findById(reviewId);
    if (!review) {
      return { success: false, error: "Invite not found" };
    }
    if (review.status !== "pending") {
      return { success: false, error: "Only pending invites can be cancelled" };
    }

    review.status = "cancelled";
    await review.save();
    return { success: true };
  } catch (error) {
    console.error("Failed to cancel review invite:", error);
    return { success: false, error: "Failed to cancel invite" };
  }
}

export async function setReviewPublished(reviewId: string, published: boolean) {
  const isAdmin = await verifyAuth();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await connectDB();
    const review = await Review.findById(reviewId);
    if (!review) {
      return { success: false, error: "Review not found" };
    }
    if (review.status !== "submitted") {
      return { success: false, error: "Only submitted reviews can be shown on the site" };
    }

    review.published = published;
    await review.save();
    revalidatePath("/");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    console.error("Failed to update review visibility:", error);
    return { success: false, error: "Failed to update review" };
  }
}

export async function getReviewInviteByToken(token: string) {
  if (!token) {
    return null;
  }

  try {
    await connectDB();
    const review = await Review.findOne({ token }).lean();
    if (!review) {
      return null;
    }

    return serializeReview(review as unknown as IReview & { _id: unknown });
  } catch (error) {
    console.error("Failed to load review invite:", error);
    return null;
  }
}

export async function submitReview(input: {
  token: string;
  rating: number;
  comment: string;
}) {
  const token = input.token?.trim();
  const comment = input.comment?.trim();
  const rating = Number(input.rating);

  if (!token) {
    return { success: false, error: "This review link is invalid." };
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { success: false, error: "Please choose a rating from 1 to 5 stars." };
  }
  if (!comment || comment.length < 10) {
    return { success: false, error: "Please share a few words about your experience." };
  }
  if (comment.length > 1000) {
    return { success: false, error: "Reviews can be at most 1000 characters." };
  }

  try {
    await connectDB();
    const review = await Review.findOne({ token });
    if (!review || review.status === "cancelled") {
      return { success: false, error: "This review invitation is no longer valid." };
    }
    if (review.status === "submitted") {
      return { success: false, error: "This review has already been submitted." };
    }

    review.rating = rating;
    review.comment = comment;
    review.status = "submitted";
    review.published = true;
    review.submittedAt = new Date();
    await review.save();

    revalidatePath("/");
    revalidatePath("/events");

    return { success: true };
  } catch (error) {
    console.error("Failed to submit review:", error);
    return { success: false, error: "Could not save your review. Please try again." };
  }
}

export async function getPublishedReviews(): Promise<PublicReview[]> {
  try {
    await connectDB();
    const reviews = await Review.find({
      status: "submitted",
      published: true,
    })
      .sort({ submittedAt: -1 })
      .lean();

    return reviews
      .filter((review) => review.rating && review.comment)
      .map((review) => ({
        id: String(review._id),
        guestName: review.guestName,
        eventType: review.eventType ?? "",
        rating: review.rating as number,
        comment: review.comment as string,
        submittedAt: review.submittedAt
          ? new Date(review.submittedAt).toISOString()
          : null,
      }));
  } catch (error) {
    console.error("Failed to load published reviews:", error);
    return [];
  }
}
