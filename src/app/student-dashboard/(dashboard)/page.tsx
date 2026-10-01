import type { Metadata } from "next";

import { StudentDashboardClient } from "@/components/student-dashboard/student-dashboard-client";

export const metadata: Metadata = {
  title: "Student Dashboard | Ensena",
  description: "Manage your lessons, tutors, homework and progress on Ensena.",
};

export default function StudentDashboardPage() {
  return <StudentDashboardClient />;
}
