"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { SupportConversation } from "@/components/support/support-conversation";
import { useSupportRequests } from "@/hooks/use-support-requests";
import { dashboardStudent } from "@/lib/student-dashboard-data";

export function StudentSupportDetailClient({ id }: { id: string }) {
  const requests = useSupportRequests();
  // A student may only view their own requests — matches this app's
  // established route-level ownership check pattern (e.g. the counselling
  // detail page's studentName scoping).
  const request = requests.find((r) => r.id === id && r.userName === dashboardStudent.name);

  if (!request) {
    return (
      <div className="rounded-2xl border border-ensena-border bg-ensena-surface p-10 text-center">
        <p className="text-sm text-ensena-muted">This support request could not be found.</p>
        <Link href="/student-dashboard/support" className="mt-3 inline-flex text-sm font-semibold text-ensena-primary hover:underline">← Back to Support</Link>
      </div>
    );
  }

  const relatedRecordHref =
    request.relatedRecordType === "booking" && request.relatedRecordId
      ? `/student-dashboard/lessons/class/${request.relatedRecordId}`
      : request.relatedRecordType === "group-class" && request.relatedRecordId
        ? `/student-dashboard/group-classes/${request.relatedRecordId}`
        : request.relatedRecordType === "counselling" && request.relatedRecordId
          ? `/student-dashboard/counselling/${request.relatedRecordId}`
          : undefined;

  return (
    <div>
      <Link href="/student-dashboard/support" className="flex items-center gap-1 text-sm font-medium text-ensena-muted hover:text-ensena-ink">
        <ChevronLeft className="size-4" /> Back to Support
      </Link>
      <div className="mt-3">
        <SupportConversation request={request} currentUserName={dashboardStudent.name} relatedRecordHref={relatedRecordHref} />
      </div>
    </div>
  );
}
