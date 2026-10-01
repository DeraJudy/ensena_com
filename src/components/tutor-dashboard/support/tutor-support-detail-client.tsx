"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { SupportConversation } from "@/components/support/support-conversation";
import { useSupportRequests } from "@/hooks/use-support-requests";
import { dashboardTutor } from "@/lib/tutor-dashboard-data";

export function TutorSupportDetailClient({ id }: { id: string }) {
  const requests = useSupportRequests();
  const request = requests.find((r) => r.id === id && r.userName === dashboardTutor.name);

  if (!request) {
    return (
      <div className="rounded-2xl border border-ensena-border bg-ensena-surface p-10 text-center">
        <p className="text-sm text-ensena-muted">This support request could not be found.</p>
        <Link href="/tutor-dashboard/support" className="mt-3 inline-flex text-sm font-semibold text-ensena-primary hover:underline">← Back to Support</Link>
      </div>
    );
  }

  const relatedRecordHref =
    request.relatedRecordType === "booking"
      ? "/tutor-dashboard/private-lessons"
      : request.relatedRecordType === "group-class"
        ? "/tutor-dashboard/private-lessons?tab=Group Classes"
        : request.relatedRecordType === "payout"
          ? "/tutor-dashboard/withdrawals"
          : undefined;

  return (
    <div>
      <Link href="/tutor-dashboard/support" className="flex items-center gap-1 text-sm font-medium text-ensena-muted hover:text-ensena-ink">
        <ChevronLeft className="size-4" /> Back to Support
      </Link>
      <div className="mt-3">
        <SupportConversation request={request} currentUserName={dashboardTutor.name} relatedRecordHref={relatedRecordHref} />
      </div>
    </div>
  );
}
