import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StudentTutorDetailClient } from "@/components/student-dashboard/tutors/student-tutor-detail-client";
import { myTutors } from "@/lib/student-dashboard-data";

export function generateStaticParams() {
  return myTutors.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const tutor = myTutors.find((t) => t.id === id);
  return { title: tutor ? `${tutor.name} | Ensena Student Dashboard` : "Tutor | Ensena" };
}

export default async function StudentTutorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tutor = myTutors.find((t) => t.id === id);
  if (!tutor) notFound();
  return <StudentTutorDetailClient tutor={tutor} />;
}
