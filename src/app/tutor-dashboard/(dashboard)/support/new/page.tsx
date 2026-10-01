import type { Metadata } from "next";
import { Suspense } from "react";

import { TutorSupportNewClient } from "@/components/tutor-dashboard/support/tutor-support-new-client";

export const metadata: Metadata = {
  title: "Contact Support | Ensena Tutor Dashboard",
};

export default function TutorSupportNewPage() {
  return (
    <Suspense fallback={null}>
      <TutorSupportNewClient />
    </Suspense>
  );
}
