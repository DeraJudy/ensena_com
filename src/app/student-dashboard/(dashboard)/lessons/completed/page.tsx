import type { Metadata } from "next";

import { CompletedClassesClient } from "@/components/student-dashboard/lessons/completed-classes-client";

export const metadata: Metadata = {
  title: "Completed Classes | Ensena Student Dashboard",
};

export default function CompletedClassesPage() {
  return <CompletedClassesClient />;
}
