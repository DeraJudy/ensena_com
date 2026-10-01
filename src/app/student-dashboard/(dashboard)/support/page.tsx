import type { Metadata } from "next";

import { StudentSupportListClient } from "@/components/student-dashboard/support/student-support-list-client";

export const metadata: Metadata = {
  title: "Support | Ensena Student Dashboard",
};

export default function StudentSupportPage() {
  return <StudentSupportListClient />;
}
