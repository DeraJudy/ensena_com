import { Suspense } from "react";

import { AdminSupportClient } from "@/components/admin/admin-support-client";

export default function AdminSupportPage() {
  return (
    <Suspense fallback={null}>
      <AdminSupportClient />
    </Suspense>
  );
}
