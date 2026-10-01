import type { Metadata } from "next";
import { Suspense } from "react";

import { FindATutorClient } from "@/components/student-dashboard/find-a-tutor/find-a-tutor-client";

export const metadata: Metadata = {
  title: "Find a Tutor | Ensena Student Dashboard",
};

export default function FindATutorPage() {
  return (
    <Suspense fallback={null}>
      <FindATutorClient />
    </Suspense>
  );
}
