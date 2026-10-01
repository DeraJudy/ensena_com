import type { Metadata } from "next";
import { Suspense } from "react";

import { MessagesClient } from "@/components/tutor-dashboard/messages/messages-client";

export const metadata: Metadata = {
  title: "Messages | Ensena Tutor Dashboard",
};

// "Requests & Pre-approvals" (previously tabbed alongside Messages here via
// InboxHubClient) still exists at /tutor-dashboard/offers and Send
// Pre-approval/Send Special Offer are still reachable from a conversation's
// "..." menu — this page just no longer wraps Messages in that tab switch,
// matching the simplified single-inbox MVP design.
export default function MessagesPage() {
  return (
    <Suspense fallback={null}>
      <MessagesClient />
    </Suspense>
  );
}
