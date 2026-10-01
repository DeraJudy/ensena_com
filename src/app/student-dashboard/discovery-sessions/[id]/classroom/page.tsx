import { DiscoveryClassroomClient } from "@/components/classroom/discovery-classroom-client";

export default async function StudentDiscoveryClassroomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DiscoveryClassroomClient role="student" id={id} leaveHref={`/student-dashboard/discovery-sessions/${id}/follow-up`} />;
}
