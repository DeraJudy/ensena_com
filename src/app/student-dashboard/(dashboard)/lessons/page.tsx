import type { Metadata } from "next";
import { Suspense } from "react";

import { MyClassesClient } from "@/components/student-dashboard/lessons/my-lessons-client";

export const metadata: Metadata = {
  title: "My Classes | Ensena Student Dashboard",
};

export default function MyLessonsPage() {
  return (
    <Suspense fallback={null}>
      <MyClassesClient />
    </Suspense>
  );
}
