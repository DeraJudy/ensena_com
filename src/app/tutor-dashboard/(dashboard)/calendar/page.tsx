import type { Metadata } from "next";

import { CalendarClient } from "@/components/tutor-dashboard/calendar/calendar-client";

export const metadata: Metadata = {
  title: "Calendar | Ensena Tutor Dashboard",
};

export default function CalendarPage() {
  return <CalendarClient />;
}
