import type { Metadata } from "next";

import { GroupClassroomClient } from "@/components/classroom/group-classroom-client";
import { studentGroupClasses } from "@/lib/student-dashboard-data";

export function generateStaticParams() {
  return studentGroupClasses.map((c) => ({ id: c.id }));
}

export async function generateMetadata(): Promise<Metadata> {
  // Real group-class data (a student's real enrollment) only exists
  // client-side (see GroupClassroomClient's own doc comment) — a Server
  // Component genuinely cannot resolve it, so metadata stays generic rather
  // than risking a wrong title for the case that matters most (a real,
  // non-seed enrollment).
  return { title: "Classroom | Ensena" };
}

export default async function StudentGroupClassroomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GroupClassroomClient role="student" id={id} fallbackLeaveHref={`/student-dashboard/group-classes/${id}`} />;
}
