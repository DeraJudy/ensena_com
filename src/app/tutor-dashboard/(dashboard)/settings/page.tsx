import type { Metadata } from "next";

import { SettingsClient } from "@/components/tutor-dashboard/settings/settings-client";

export const metadata: Metadata = {
  title: "Settings | Ensena Tutor Dashboard",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
