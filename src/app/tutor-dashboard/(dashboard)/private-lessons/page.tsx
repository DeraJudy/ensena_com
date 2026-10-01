import type { Metadata } from "next";
import { Suspense } from "react";

import { MyLessonsHubClient } from "@/components/tutor-dashboard/lessons-hub/my-lessons-hub-client";

export const metadata: Metadata = {
  title: "My Lessons | Ensena Tutor Dashboard",
};

export default function PrivateLessonsPage() {
  return (
    <Suspense fallback={null}>
      <MyLessonsHubClient />
    </Suspense>
  );
}
