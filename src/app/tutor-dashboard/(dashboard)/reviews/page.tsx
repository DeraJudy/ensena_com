import type { Metadata } from "next";

import { ReviewsClient } from "@/components/tutor-dashboard/reviews/reviews-client";

export const metadata: Metadata = {
  title: "Reviews | Ensena Tutor Dashboard",
};

export default function ReviewsPage() {
  return <ReviewsClient />;
}
