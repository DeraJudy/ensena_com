import type { Metadata } from "next";
import { Suspense } from "react";

import { StudentSupportNewClient } from "@/components/student-dashboard/support/student-support-new-client";

export const metadata: Metadata = {
  title: "Contact Support | Ensena Student Dashboard",
};

export default function StudentSupportNewPage() {
  return (
    <Suspense fallback={null}>
      <StudentSupportNewClient />
    </Suspense>
  );
}
