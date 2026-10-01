import type { Metadata } from "next";

import { AdminSupportDetailClient } from "@/components/admin/admin-support-detail-client";

export const metadata: Metadata = {
  title: "Support Request | Ensena Admin",
};

export default async function AdminSupportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminSupportDetailClient id={id} />;
}
