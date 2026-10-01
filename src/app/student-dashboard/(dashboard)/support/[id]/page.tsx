import type { Metadata } from "next";

import { StudentSupportDetailClient } from "@/components/student-dashboard/support/student-support-detail-client";

export const metadata: Metadata = {
  title: "Support Request | Ensena Student Dashboard",
};

export default async function StudentSupportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StudentSupportDetailClient id={id} />;
}
