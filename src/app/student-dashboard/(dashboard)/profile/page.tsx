import type { Metadata } from "next";

import { StudentProfileClient } from "@/components/student-dashboard/profile/student-profile-client";

export const metadata: Metadata = {
  title: "Profile | Ensena Student Dashboard",
};

export default function StudentProfilePage() {
  return <StudentProfileClient />;
}
