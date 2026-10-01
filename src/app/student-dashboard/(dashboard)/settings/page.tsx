import type { Metadata } from "next";
import { Suspense } from "react";

import { StudentSettingsClient } from "@/components/student-dashboard/settings/student-settings-client";

export const metadata: Metadata = {
  title: "Settings | Ensena Student Dashboard",
};

export default function StudentSettingsPage() {
  return (
    <Suspense fallback={null}>
      <StudentSettingsClient />
    </Suspense>
  );
}
