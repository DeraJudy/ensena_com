import type { Metadata } from "next";

import { TutorSupportListClient } from "@/components/tutor-dashboard/support/tutor-support-list-client";

export const metadata: Metadata = {
  title: "Support | Ensena Tutor Dashboard",
};

export default function TutorSupportPage() {
  return <TutorSupportListClient />;
}
