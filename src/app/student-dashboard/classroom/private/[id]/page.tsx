import type { Metadata } from "next";

import { PrivateClassroomPageClient } from "@/components/classroom/private-classroom-page-client";
import { studentLessons } from "@/lib/student-dashboard-data";

export function generateStaticParams() {
  return studentLessons.map((l) => ({ id: l.id }));
}

export async function generateMetadata(): Promise<Metadata> {
  // Real lesson data only exists client-side (see PrivateClassroomPageClient's
  // own doc comment) — a Server Component genuinely cannot resolve it for a
  // real booking, so metadata stays generic rather than risking a wrong
  // title for the one case that matters most (a real, non-seed lesson).
  return { title: "Classroom | Ensena" };
}

export default async function StudentPrivateClassroomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PrivateClassroomPageClient role="student" id={id} />;
}
