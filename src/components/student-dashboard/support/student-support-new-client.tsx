"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { SupportRequestForm } from "@/components/support/support-request-form";
import { dashboardStudent } from "@/lib/student-dashboard-data";
import { resolveRelatedRecord } from "@/lib/support-related-record";
import type { RelatedRecordType, SupportContext, SupportSource } from "@/lib/support-data";

const STUDENT_CONTEXTS: SupportContext[] = ["student", "booking", "group-class", "payment", "counselling", "account", "technical"];

export function StudentSupportNewClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contextParam = searchParams.get("context") as SupportContext | null;
  const context: SupportContext = contextParam && STUDENT_CONTEXTS.includes(contextParam) ? contextParam : "student";
  const relatedRecordType = searchParams.get("relatedRecordType") as RelatedRecordType | null;
  const relatedRecordId = searchParams.get("relatedRecordId");
  const relatedRecordLabel = searchParams.get("relatedRecordLabel");
  const presetCategory = searchParams.get("category") ?? undefined;
  const source = (searchParams.get("source") as SupportSource | null) ?? undefined;

  const related = resolveRelatedRecord(relatedRecordType, relatedRecordId, relatedRecordLabel);

  return (
    <SupportRequestForm
      context={context}
      userRole="Student"
      userName={dashboardStudent.name}
      related={related}
      presetCategory={presetCategory}
      source={source}
      onSubmitted={(id) => router.push(`/student-dashboard/support/${id}`)}
    />
  );
}
