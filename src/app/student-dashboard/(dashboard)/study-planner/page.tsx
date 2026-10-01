import type { Metadata } from "next";

import { StudyPlannerClient } from "@/components/student-dashboard/study-planner/study-planner-client";

export const metadata: Metadata = {
  title: "Study Planner | Ensena Student Dashboard",
};

export default function StudyPlannerPage() {
  return <StudyPlannerClient />;
}
