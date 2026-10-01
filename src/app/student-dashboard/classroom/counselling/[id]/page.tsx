import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClassroomShell } from "@/components/classroom/classroom-shell";
import { getClassroomSession } from "@/lib/classroom-data";
import { initialCounsellingAppointments } from "@/lib/admin-counselling-data";

export function generateStaticParams() {
  return initialCounsellingAppointments.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const session = getClassroomSession("student", "counselling", id);
  return { title: session ? `Counselling with ${session.tutorName} | Ensena` : "Counselling Session | Ensena" };
}

export default async function StudentCounsellingClassroomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getClassroomSession("student", "counselling", id);
  if (!session) notFound();
  return <ClassroomShell role="student" session={session} leaveHref={`/student-dashboard/counselling/${id}`} />;
}
