import type { Metadata } from "next";

import { DiscoveryClassroomClient } from "@/components/classroom/discovery-classroom-client";
import { getClassroomSession } from "@/lib/classroom-data";
import { discoverySessions } from "@/lib/discovery-sessions-data";

// Only the static seed sessions exist at build/server time — a session
// booked at runtime (localStorage-only) is invisible to the server, so
// generateStaticParams/generateMetadata (both server-only) can only ever
// know about seeded ones. The actual session lookup that matters — the one
// deciding whether this classroom exists at all — happens client-side in
// DiscoveryClassroomClient, which CAN see a runtime booking.
export function generateStaticParams() {
  return discoverySessions.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const session = getClassroomSession("tutor", "discovery", id);
  return { title: session ? `Discovery Session · Classroom | Ensena` : "Classroom | Ensena" };
}

export default async function TutorDiscoveryClassroomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DiscoveryClassroomClient role="tutor" id={id} leaveHref={`/tutor-dashboard/discovery-sessions/${id}/recommend`} />;
}
