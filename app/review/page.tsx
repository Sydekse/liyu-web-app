import { Navbar } from "@/components/layout/navbar";
import { Card } from "@/components/ui/card";
import { OpenReviewForm } from "@/components/reviews/open-review-form";

export default function PublicReviewPage() {
  return (
    <div>
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-lg mx-auto px-4">
          <Card className="p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-[#532516] mb-2">
              Share your experience
            </h1>
            <p className="text-gray-600 mb-6">
              If Liyu Catering hosted your event, we would love to hear how it
              went. You do not need a booking on file — anyone we have served
              can leave a review here.
            </p>
            <OpenReviewForm />
          </Card>
        </div>
      </div>
    </div>
  );
}
