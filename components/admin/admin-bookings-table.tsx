"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Copy, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IBooking, BookingStatus } from "@/lib/models/booking";
import { ReviewInvite } from "@/lib/actions/review.actions";
import { updateBookingStatus } from "@/lib/actions/booking.actions";
import { inviteReviewFromBooking } from "@/lib/actions/review.actions";
import { StatusBadge } from "@/components/admin/status-badge";

function reviewLink(token: string) {
  if (typeof window === "undefined") {
    return `/review/${token}`;
  }
  return `${window.location.origin}/review/${token}`;
}

export function AdminBookingsTable({
  bookings,
  reviews,
  onRefresh,
}: {
  bookings: IBooking[];
  reviews: ReviewInvite[];
  onRefresh: () => Promise<void>;
}) {
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");

  const reviewsByBooking = useMemo(() => {
    const map = new Map<string, ReviewInvite>();
    for (const review of reviews) {
      if (!review.bookingId) continue;
      const current = map.get(review.bookingId);
      if (!current) {
        map.set(review.bookingId, review);
        continue;
      }
      if (current.status === "cancelled" && review.status !== "cancelled") {
        map.set(review.bookingId, review);
      }
    }
    return map;
  }, [reviews]);

  const copyLink = async (token: string) => {
    await navigator.clipboard.writeText(reviewLink(token));
    setMessage("Review link copied.");
  };

  const handleStatus = async (bookingId: string, status: BookingStatus) => {
    setBusyId(bookingId);
    setMessage("");
    const result = await updateBookingStatus(bookingId, status);
    if (!result.success) {
      setMessage(result.error ?? "Could not update status.");
    }
    await onRefresh();
    setBusyId("");
  };

  const handleInvite = async (bookingId: string) => {
    setBusyId(bookingId);
    setMessage("");
    const result = await inviteReviewFromBooking(bookingId);
    if (!result.success || !result.review) {
      setMessage(result.error ?? "Could not create a review invite.");
      setBusyId("");
      return;
    }

    await copyLink(result.review.token);
    setMessage(
      result.alreadyExists
        ? "This guest already has an invite. Link copied."
        : "Review invite created. Link copied.",
    );
    await onRefresh();
    setBusyId("");
  };

  if (bookings.length === 0) {
    return (
      <Card className="p-8 text-center text-gray-600">
        No booking inquiries yet.
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {message ? <p className="text-sm text-[#532516]">{message}</p> : null}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requested</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Event date</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Review</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => {
                const id = booking._id ?? "";
                const invite = id ? reviewsByBooking.get(id) : undefined;
                return (
                  <TableRow key={id || `${booking.email}-${booking.createdAt}`}>
                    <TableCell>
                      {format(new Date(booking.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {booking.firstName} {booking.lastName}
                    </TableCell>
                    <TableCell>{booking.eventType}</TableCell>
                    <TableCell>
                      {format(new Date(booking.eventDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{booking.guestCount}</TableCell>
                    <TableCell>
                      <Select
                        value={booking.status}
                        disabled={!id || busyId === id}
                        onValueChange={(value) =>
                          handleStatus(id, value as BookingStatus)
                        }
                      >
                        <SelectTrigger className="w-[130px] h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{booking.email}</div>
                        <div>{booking.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {invite && invite.status !== "cancelled" ? (
                        <div className="flex flex-col gap-2">
                          <StatusBadge kind="review" status={invite.status} />
                          {invite.status === "pending" ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => copyLink(invite.token)}
                            >
                              <Copy className="h-3.5 w-3.5 mr-1" />
                              Copy link
                            </Button>
                          ) : null}
                        </div>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          className="bg-[#532516] hover:bg-[#E8982E]"
                          disabled={!id || busyId === id}
                          onClick={() => handleInvite(id)}
                        >
                          <Link2 className="h-3.5 w-3.5 mr-1" />
                          Ask for review
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
