import type { Metadata } from "next";
import { Suspense } from "react";

import { StudentsClient } from "@/components/tutor-dashboard/students/students-client";

export const metadata: Metadata = {
  title: "Students | Ensena Tutor Dashboard",
};

export default function StudentsPage() {
  return (
    <Suspense fallback={null}>
      <StudentsClient />
    </Suspense>
  );
}
