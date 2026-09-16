"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitReview } from "@/lib/actions/review.actions";

export function ReviewForm({
  token,
  guestName,
  eventType,
}: {
  token: string;
  guestName: string;
  eventType?: string;
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await submitReview({ token, rating, comment });
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error ?? "Could not save your review.");
      }
    } catch {
      setError("Could not save your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-[#532516] mb-3">Thank you</h2>
        <p className="text-gray-600">
          Your review has been received. We are glad we could be part of your
          event.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-sm text-gray-500 mb-1">Reviewing as</p>
        <p className="font-semibold text-[#532516]">{guestName}</p>
        {eventType ? (
          <p className="text-sm text-gray-600 mt-1">{eventType}</p>
        ) : null}
      </div>

      <div>
        <Label className="mb-2 block">How was your experience?</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => {
            const active = (hovered || rating) >= value;
            return (
              <button
                key={value}
                type="button"
                onMouseEnter={() => setHovered(value)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(value)}
                className="p-1"
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
              >
                <Star
                  className={`h-8 w-8 ${
                    active ? "fill-[#E8982E] text-[#E8982E]" : "text-gray-300"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label htmlFor="comment">Your review</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us what stood out about the food, service, or the day itself."
          className="mt-2 min-h-[140px]"
          maxLength={1000}
          required
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#532516] hover:bg-[#E8982E]"
      >
        {submitting ? "Sending..." : "Submit review"}
      </Button>
    </form>
  );
}
