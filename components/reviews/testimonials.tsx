import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";
import { getPublishedReviews } from "@/lib/actions/review.actions";
import { PREVIOUS_EVENTS } from "@/lib/constants";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 mb-3" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={`h-4 w-4 ${
            value <= rating ? "fill-[#E8982E] text-[#E8982E]" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export async function Testimonials() {
  const reviews = await getPublishedReviews();
  const items =
    reviews.length > 0
      ? reviews.map((review) => ({
          id: review.id,
          quote: review.comment,
          name: review.guestName,
          detail: review.eventType,
          rating: review.rating,
        }))
      : PREVIOUS_EVENTS.map((event) => ({
          id: event.title,
          quote: event.testimonial,
          name: event.client,
          detail: event.title,
          rating: 5,
        }));

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#532516] mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from guests we have hosted — whether they booked online or
            worked with us directly.
          </p>
          <Link
            href="/review"
            className="inline-flex mt-6 bg-[#532516] text-white px-4 py-2 rounded-md hover:bg-[#E8982E] transition-colors"
          >
            Leave a review
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <Card key={item.id} className="p-6">
              <Stars rating={item.rating} />
              <div className="flex items-start">
                <Quote className="w-5 h-5 text-[#E8982E] mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-600 italic">&quot;{item.quote}&quot;</p>
                  <p className="text-[#532516] font-semibold mt-3">
                    {item.name}
                  </p>
                  {item.detail ? (
                    <p className="text-sm text-gray-500">{item.detail}</p>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
