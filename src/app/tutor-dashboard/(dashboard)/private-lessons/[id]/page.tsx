import type { Metadata } from "next";

import { TutorClassDetailClient } from "@/components/tutor-dashboard/lessons/tutor-class-detail-client";
import { initialPrivateLessons } from "@/lib/tutor-dashboard-data";

export function generateStaticParams() {
  return initialPrivateLessons.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const lesson = initialPrivateLessons.find((l) => l.id === id);
  return { title: lesson ? `${lesson.subject} | Ensena Tutor Dashboard` : "Class Details | Ensena" };
}

export default async function TutorClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TutorClassDetailClient id={id} />;
}
