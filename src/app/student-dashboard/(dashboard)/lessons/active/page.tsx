import type { Metadata } from "next";

import { ActiveClassesClient } from "@/components/student-dashboard/lessons/active-classes-client";

export const metadata: Metadata = {
  title: "Active Classes | Ensena Student Dashboard",
};

export default function ActiveClassesPage() {
  return <ActiveClassesClient />;
}
