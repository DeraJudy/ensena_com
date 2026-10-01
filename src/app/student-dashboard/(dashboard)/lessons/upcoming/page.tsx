import type { Metadata } from "next";

import { UpcomingClassesClient } from "@/components/student-dashboard/lessons/upcoming-classes-client";

export const metadata: Metadata = {
  title: "Upcoming Classes | Ensena Student Dashboard",
};

export default function UpcomingClassesPage() {
  return <UpcomingClassesClient />;
}
