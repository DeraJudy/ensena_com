import type { Metadata } from "next";

import { TutorDiscoverySessionsClient } from "@/components/tutor-dashboard/discovery-sessions/discovery-sessions-client";

export const metadata: Metadata = {
  title: "Discovery Sessions | Ensena Tutor Dashboard",
};

export default function TutorDiscoverySessionsPage() {
  return <TutorDiscoverySessionsClient />;
}
