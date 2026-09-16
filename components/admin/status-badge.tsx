import { cn } from "@/lib/utils";
import { BookingStatus } from "@/lib/models/booking";
import { ReviewStatus } from "@/lib/models/review";

const bookingStyles: Record<BookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const reviewStyles: Record<ReviewStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  submitted: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-700",
};

export function StatusBadge({
  kind,
  status,
  className,
}: {
  kind: "booking" | "review";
  status: BookingStatus | ReviewStatus;
  className?: string;
}) {
  const styles =
    kind === "booking"
      ? bookingStyles[status as BookingStatus]
      : reviewStyles[status as ReviewStatus];

  return (
    <span
      className={cn(
        "inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize",
        styles,
        className,
      )}
    >
      {status}
    </span>
  );
}
