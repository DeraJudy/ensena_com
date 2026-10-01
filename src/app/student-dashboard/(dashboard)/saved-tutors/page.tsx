import type { Metadata } from "next";

import { SavedTutorsClient } from "@/components/student-dashboard/saved-tutors/saved-tutors-client";

export const metadata: Metadata = {
  title: "Saved Tutors | Ensena Student Dashboard",
};

export default function SavedTutorsPage() {
  return <SavedTutorsClient />;
}
