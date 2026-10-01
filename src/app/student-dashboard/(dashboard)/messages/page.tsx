import type { Metadata } from "next";
import { Suspense } from "react";

import { StudentMessagesClient } from "@/components/student-dashboard/messages/student-messages-client";

export const metadata: Metadata = {
  title: "Messages | Ensena Student Dashboard",
};

export default function StudentMessagesPage() {
  return (
    <Suspense fallback={null}>
      <StudentMessagesClient />
    </Suspense>
  );
}
