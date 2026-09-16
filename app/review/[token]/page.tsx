import { Navbar } from "@/components/layout/navbar";
import { Card } from "@/components/ui/card";
import { ReviewForm } from "@/components/reviews/review-form";
import { getReviewInviteByToken } from "@/lib/actions/review.actions";

export const dynamic = "force-dynamic";

export default async function ReviewPage({
  params,
}: {
  params: { token: string };
}) {
  const invite = await getReviewInviteByToken(params.token);

  return (
    <div>
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-lg mx-auto px-4">
          <Card className="p-6 sm:p-8">
            {!invite || invite.status === "cancelled" ? (
              <div className="text-center py-6">
                <h1 className="text-2xl font-bold text-[#532516] mb-3">
                  Invitation unavailable
                </h1>
                <p className="text-gray-600">
                  This review link is invalid or has been withdrawn. If you
                  recently worked with Liyu Catering, please reach out to us
                  directly.
                </p>
              </div>
            ) : invite.status === "submitted" ? (
              <div className="text-center py-6">
                <h1 className="text-2xl font-bold text-[#532516] mb-3">
                  Review already received
                </h1>
                <p className="text-gray-600">
                  Thank you — this invitation has already been used. We
                  appreciate you taking the time.
                </p>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-[#532516] mb-2">
                  Share your experience
                </h1>
                <p className="text-gray-600 mb-6">
                  Liyu Catering invited you to leave a review of your event.
                  This page is only available through your personal link.
                </p>
                <ReviewForm
                  token={invite.token}
                  guestName={invite.guestName}
                  eventType={invite.eventType}
                />
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
