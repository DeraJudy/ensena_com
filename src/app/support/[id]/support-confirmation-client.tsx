"use client";

import Link from "next/link";

import { useSupportRequests } from "@/hooks/use-support-requests";
import { SupportSubmittedConfirmation } from "@/components/support/support-request-form";

// Anonymous/guest requests have no session to prove ownership on a return
// visit, so this is a plain confirmation (not a persistent conversation
// view) — it only resolves within the same browser that just submitted the
// request, via the same local store every other role reads.
export function SupportConfirmationClient({ id }: { id: string }) {
  const requests = useSupportRequests();
  const request = requests.find((r) => r.id === id);

  if (!request) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-sm text-ensena-muted">We couldn&apos;t find that support request in this browser.</p>
        <Link href="/support/new" className="mt-3 inline-flex text-sm font-semibold text-ensena-primary hover:underline">
          ← Submit a new request
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <SupportSubmittedConfirmation supportId={request.id} />
    </div>
  );
}
