import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GroupClassDetailClient } from "@/components/tutor-dashboard/group-classes/group-class-detail-client";
import { initialMyGroupClasses } from "@/lib/tutor-dashboard-data";

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function findBySlug(slug: string) {
  return initialMyGroupClasses.find((c) => slugify(c.title) === slug);
}

export function generateStaticParams() {
  return initialMyGroupClasses.map((c) => ({ slug: slugify(c.title) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const groupClass = findBySlug(slug);
  return { title: groupClass ? `${groupClass.title} | Ensena Tutor Dashboard` : "Group Class | Ensena" };
}

export default async function GroupClassDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const groupClass = findBySlug(slug);
  if (!groupClass) notFound();
  return <GroupClassDetailClient groupClass={groupClass} />;
}
