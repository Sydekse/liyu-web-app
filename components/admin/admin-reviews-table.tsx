"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Copy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EVENT_TYPES } from "@/lib/constants";
import {
  ReviewInvite,
  cancelReviewInvite,
  inviteCustomReview,
  setReviewPublished,
} from "@/lib/actions/review.actions";
import { StatusBadge } from "@/components/admin/status-badge";

function reviewLink(token: string) {
  if (typeof window === "undefined") {
    return `/review/${token}`;
  }
  return `${window.location.origin}/review/${token}`;
}

export function AdminReviewsTable({
  reviews,
  onRefresh,
}: {
  reviews: ReviewInvite[];
  onRefresh: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [eventType, setEventType] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState("");
  const [creating, setCreating] = useState(false);

  const copyLink = async (token: string) => {
    await navigator.clipboard.writeText(reviewLink(token));
    setMessage("Review link copied.");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setMessage("");
    const result = await inviteCustomReview({ guestName, email, eventType });
    if (!result.success || !result.review) {
      setMessage(result.error ?? "Could not create invite.");
      setCreating(false);
      return;
    }

    await copyLink(result.review.token);
    setGuestName("");
    setEmail("");
    setEventType("");
    setOpen(false);
    setCreating(false);
    await onRefresh();
  };

  const handleCancel = async (id: string) => {
    setBusyId(id);
    const result = await cancelReviewInvite(id);
    if (!result.success) {
      setMessage(result.error ?? "Could not cancel invite.");
    }
    await onRefresh();
    setBusyId("");
  };

  const handlePublish = async (id: string, published: boolean) => {
    setBusyId(id);
    const result = await setReviewPublished(id, published);
    if (!result.success) {
      setMessage(result.error ?? "Could not update visibility.");
    }
    await onRefresh();
    setBusyId("");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-gray-600">
          Booking guests can be invited with a private link. Anyone else can
          submit from the public Reviews page; those stay hidden until you
          publish them.
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#532516] hover:bg-[#E8982E]">
              Invite a guest
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Invite a guest to review</DialogTitle>
                <DialogDescription>
                  Use this for clients who did not book through the website.
                  They can only submit a review with the link you send them.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="guestName">Guest name</Label>
                  <Input
                    id="guestName"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="guestEmail">Email (optional)</Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Event type</Label>
                  <Select value={eventType || undefined} onValueChange={setEventType}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select an event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map((event) => (
                        <SelectItem key={event.title} value={event.title}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={creating}
                  className="bg-[#532516] hover:bg-[#E8982E]"
                >
                  {creating ? "Creating..." : "Create and copy link"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {message ? <p className="text-sm text-[#532516]">{message}</p> : null}

      {reviews.length === 0 ? (
        <Card className="p-8 text-center text-gray-600">
          No review invitations yet. Ask a booking guest, or invite someone
          directly.
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="font-medium">{review.guestName}</div>
                      <div className="text-sm text-gray-500">{review.email}</div>
                      <div className="text-xs text-gray-400">
                        {format(new Date(review.createdAt), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      {review.source === "open" ? "Public form" : "Invite"}
                    </TableCell>
                    <TableCell>{review.eventType || "—"}</TableCell>
                    <TableCell>
                      <StatusBadge kind="review" status={review.status} />
                    </TableCell>
                    <TableCell>
                      {review.rating ? (
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-[#E8982E] text-[#E8982E]" />
                          {review.rating}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {review.comment || "Waiting for the guest."}
                      </p>
                    </TableCell>
                    <TableCell>
                      {review.status === "submitted"
                        ? review.published
                          ? "Published"
                          : "Hidden"
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2 min-w-[140px]">
                        {review.status === "pending" && review.source !== "open" ? (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => copyLink(review.token)}
                            >
                              <Copy className="h-3.5 w-3.5 mr-1" />
                              Copy link
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={busyId === review.id}
                              onClick={() => handleCancel(review.id)}
                            >
                              Cancel invite
                            </Button>
                          </>
                        ) : null}
                        {review.status === "submitted" ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={busyId === review.id}
                            onClick={() =>
                              handlePublish(review.id, !review.published)
                            }
                          >
                            {review.published ? "Hide on site" : "Publish"}
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
