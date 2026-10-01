import type { Metadata } from "next";

import { TutorSupportDetailClient } from "@/components/tutor-dashboard/support/tutor-support-detail-client";

export const metadata: Metadata = {
  title: "Support Request | Ensena Tutor Dashboard",
};

export default async function TutorSupportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TutorSupportDetailClient id={id} />;
}
