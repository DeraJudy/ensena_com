import type { Metadata } from "next";

import { GroupClassroomClient } from "@/components/classroom/group-classroom-client";
import { initialMyGroupClasses } from "@/lib/tutor-dashboard-data";

export function generateStaticParams() {
  return initialMyGroupClasses.map((c) => ({ id: c.id }));
}

export async function generateMetadata(): Promise<Metadata> {
  // Real group-class data (a tutor-approved submission, or a student's real
  // enrollment) only exists client-side (see GroupClassroomClient's own doc
  // comment) — a Server Component genuinely cannot resolve it, so metadata
  // stays generic rather than risking a wrong title for the case that
  // matters most (a real, non-seed class).
  return { title: "Classroom | Ensena" };
}

export default async function TutorGroupClassroomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GroupClassroomClient role="tutor" id={id} fallbackLeaveHref="/tutor-dashboard/group-classes" />;
}
