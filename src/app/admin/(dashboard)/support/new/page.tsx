import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminSupportNewClient } from "@/components/admin/admin-support-new-client";

export const metadata: Metadata = {
  title: "Contact Support | Ensena Admin",
};

export default function AdminSupportNewPage() {
  return (
    <Suspense fallback={null}>
      <AdminSupportNewClient />
    </Suspense>
  );
}
