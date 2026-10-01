import type { Metadata } from "next";

import { GroupClassesClient } from "@/components/tutor-dashboard/group-classes/group-classes-client";

export const metadata: Metadata = {
  title: "Group Classes | Ensena Tutor Dashboard",
};

export default function GroupClassesPage() {
  return <GroupClassesClient />;
}
