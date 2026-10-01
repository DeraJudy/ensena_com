"use client";

import { useState } from "react";
import Link from "next/link";
import { Paperclip, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { addSupportReply } from "@/lib/support-store";
import type { SupportPriority, SupportRequest, SupportStatus } from "@/lib/support-data";
import { cn } from "@/lib/utils";

export const supportStatusStyles: Record<SupportStatus, string> = {
  Open: "bg-amber-100 text-amber-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Waiting for User": "bg-purple-100 text-purple-700",
  Resolved: "bg-emerald-100 text-emerald-700",
  Closed: "bg-ensena-bg-soft text-ensena-muted",
};

export const supportPriorityStyles: Record<SupportPriority, string> = {
  Low: "bg-ensena-bg-soft text-ensena-muted",
  Normal: "bg-ensena-bg-soft text-ensena-muted",
  High: "bg-amber-100 text-amber-700",
  Urgent: "bg-rose-100 text-rose-700",
};

// The requester's own read-and-reply view of a support request (student's
// or tutor's "My Requests" detail page). Admin/staff get a separate, richer
// full-page layout (admin-support-detail-client.tsx) that matches the
// Admin Support Inbox screenshots — not this component — so this stays a
// simple, single-purpose conversation view: internal notes are filtered
// out here unconditionally, since a requester must never see them.
export function SupportConversation({
  request,
  currentUserName,
  relatedRecordHref,
}: {
  request: SupportRequest;
  currentUserName: string;
  relatedRecordHref?: string;
}) {
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  function sendReply() {
    if (!reply.trim()) return;
    setSending(true);
    addSupportReply(request.id, "user", currentUserName, reply.trim());
    setReply("");
    setSending(false);
  }

  const visibleMessages = request.conversation.filter((m) => !m.isInternal);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-ensena-border bg-ensena-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-sm font-semibold text-ensena-ink">{request.id}</p>
          <div className="flex items-center gap-1.5">
            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", supportStatusStyles[request.status])}>{request.status}</span>
            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", supportPriorityStyles[request.priority])}>{request.priority}</span>
          </div>
        </div>
        <p className="mt-2 text-sm font-medium text-ensena-ink">{request.category}</p>
        {request.relatedRecordLabel && (
          <p className="mt-1 text-xs text-ensena-muted">
            Related: {request.relatedRecordLabel}
            {relatedRecordHref && (
              <Link href={relatedRecordHref} className="ml-2 font-semibold text-ensena-primary hover:underline">
                View {request.relatedRecordType === "booking" ? "Booking" : request.relatedRecordType === "group-class" ? "Class" : request.relatedRecordType === "payout" ? "Payout" : "Session"} →
              </Link>
            )}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-ensena-border bg-ensena-surface p-5">
        <h2 className="font-heading text-sm font-semibold text-ensena-ink">Conversation</h2>
        <div className="flex flex-col gap-3">
          {visibleMessages.map((m) => (
            <div key={m.id} className={cn("flex flex-col gap-0.5 rounded-2xl px-3.5 py-2.5 text-sm", m.author === "staff" ? "self-start bg-ensena-bg-soft text-ensena-ink" : "self-end bg-ensena-primary/10 text-ensena-ink")}>
              <p className="text-[11px] font-semibold text-ensena-muted">{m.authorName}</p>
              <p className="whitespace-pre-wrap">{m.text}</p>
              {m.attachments && m.attachments.length > 0 && (
                <div className="mt-1 flex flex-col gap-1">
                  {m.attachments.map((a) => (
                    <span key={a.name} className="flex items-center gap-1.5 rounded-lg bg-white px-2 py-1 text-xs text-ensena-ink">
                      <Paperclip className="size-3 shrink-0" /> {a.name} <span className="text-ensena-muted">({a.size})</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {request.status !== "Closed" && (
          <div className="mt-2 flex items-end gap-2">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={2}
              placeholder="Write a message…"
              className="flex-1 rounded-xl border border-ensena-border p-2.5 text-sm outline-none focus-visible:border-ensena-primary"
            />
            <Button onClick={sendReply} disabled={sending || !reply.trim()} className="h-10 shrink-0 rounded-full bg-ensena-primary px-4 text-sm font-semibold text-white disabled:opacity-50">
              <Send className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
