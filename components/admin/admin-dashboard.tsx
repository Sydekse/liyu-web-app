"use client";

import { useCallback, useEffect, useState } from "react";
import { LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IBooking } from "@/lib/models/booking";
import { getBooking } from "@/lib/actions/booking.actions";
import { ReviewInvite, getAdminReviews } from "@/lib/actions/review.actions";
import { AdminBookingsTable } from "@/components/admin/admin-bookings-table";
import { AdminReviewsTable } from "@/components/admin/admin-reviews-table";

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [reviews, setReviews] = useState<ReviewInvite[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [nextBookings, nextReviews] = await Promise.all([
      getBooking(),
      getAdminReviews(),
    ]);
    setBookings(nextBookings ?? []);
    setReviews(nextReviews ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const pendingBookings = bookings.filter((booking) => booking.status === "pending").length;
  const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed").length;
  const pendingReviews = reviews.filter((review) => review.status === "pending").length;
  const publishedReviews = reviews.filter(
    (review) => review.status === "submitted" && review.published,
  ).length;

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#532516]">Admin dashboard</h1>
            <p className="text-gray-600 mt-1">
              Manage inquiries and invite selected guests to review.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setLoading(true);
                loadData();
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={onLogout}
              className="bg-[#532516] hover:bg-[#E8982E]"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pending bookings", value: pendingBookings },
            { label: "Confirmed bookings", value: confirmedBookings },
            { label: "Review invites waiting", value: pendingReviews },
            { label: "Published reviews", value: publishedReviews },
          ].map((stat) => (
            <Card key={stat.label} className="p-4">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-[#532516] mt-1">
                {loading ? "—" : stat.value}
              </p>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="bookings">
          <TabsList className="mb-4">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="bookings">
            {loading ? (
              <Card className="p-8 text-center text-gray-600">Loading bookings...</Card>
            ) : (
              <AdminBookingsTable
                bookings={bookings}
                reviews={reviews}
                onRefresh={loadData}
              />
            )}
          </TabsContent>
          <TabsContent value="reviews">
            {loading ? (
              <Card className="p-8 text-center text-gray-600">Loading reviews...</Card>
            ) : (
              <AdminReviewsTable reviews={reviews} onRefresh={loadData} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
