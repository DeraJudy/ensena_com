import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StudentPerformanceClient } from "@/components/tutor-dashboard/students/student-performance-client";
import { students } from "@/lib/tutor-dashboard-data";

export function generateStaticParams() {
  return students.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const student = students.find((s) => s.id === id);
  return { title: student ? `${student.name}: Performance | Ensena Tutor Dashboard` : "Performance | Ensena" };
}

export default async function StudentPerformancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = students.find((s) => s.id === id);
  if (!student) notFound();
  return <StudentPerformanceClient student={student} />;
}
