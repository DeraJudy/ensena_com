import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StudentProfileClient } from "@/components/tutor-dashboard/students/student-profile-client";
import { students } from "@/lib/tutor-dashboard-data";

export function generateStaticParams() {
  return students.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const student = students.find((s) => s.id === id);
  return { title: student ? `${student.name} | Ensena Tutor Dashboard` : "Student | Ensena" };
}

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = students.find((s) => s.id === id);
  if (!student) notFound();
  return <StudentProfileClient student={student} />;
}
