import type { Metadata } from "next";

import { TutorDashboardClient } from "@/components/tutor-dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "Tutor Dashboard | Ensena",
  description: "Manage your lessons, students, earnings and schedule on Ensena.",
};

export default function TutorDashboardPage() {
  return <TutorDashboardClient />;
}
