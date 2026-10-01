import type { ReactNode } from "react";

import { AccountStatusBanner } from "@/components/shared/account-status-banner";
import { StudentBottomNav } from "@/components/student-dashboard/student-bottom-nav";
import { StudentIdentityProvider, type StudentIdentityRow } from "@/components/student-dashboard/student-identity";
import { StudentMobileTopbar } from "@/components/student-dashboard/student-mobile-topbar";
import { StudentSidebar } from "@/components/student-dashboard/student-sidebar";
import { accountIdForName } from "@/lib/account-status-store";
import { dashboardStudent } from "@/lib/student-dashboard-data";
import { requireRole } from "@/lib/supabase/require-role";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// requireRole() is a no-op (returns null) until a real Supabase project is
// configured — see src/lib/supabase/env.ts — so this stays a real
// server-side gate without breaking the existing demo sign-in during the
// migration. Once configured, an unauthenticated visitor or a tutor/admin
// account is redirected before any student-only content ever renders.
export default async function StudentDashboardLayout({ children }: { children: ReactNode }) {
  const profile = await requireRole("student");

  let identity: StudentIdentityRow | null = null;
  if (profile) {
    const supabase = await getSupabaseServerClient();
    const [{ data: contact }, { data: student }, { data: guardian }] = await Promise.all([
      supabase.from("profiles").select("phone, date_of_birth").eq("id", profile.id).maybeSingle(),
      supabase.from("student_profiles").select("phone, date_of_birth, learning_for, academic_level, academic_detail, course, subjects, goal").eq("id", profile.id).maybeSingle(),
      supabase.from("student_guardians").select("full_name, relationship, email, phone, consent_status").eq("student_id", profile.id).maybeSingle(),
    ]);
    identity = {
      id: profile.id,
      fullName: profile.fullName,
      email: profile.email,
      avatarUrl: profile.avatarUrl,
      phone: contact?.phone ?? student?.phone ?? null,
      dateOfBirth: contact?.date_of_birth ?? student?.date_of_birth ?? null,
      learningFor: student?.learning_for ?? null,
      academicLevel: student?.academic_level ?? null,
      academicDetail: student?.academic_detail ?? null,
      course: student?.course ?? null,
      subjects: student?.subjects ?? null,
      goal: student?.goal ?? null,
      guardian: guardian
        ? {
            fullName: guardian.full_name,
            relationship: guardian.relationship,
            email: guardian.email,
            phone: guardian.phone,
            consentStatus: guardian.consent_status === "confirmed" ? "confirmed" : "pending",
          }
        : null,
    };
  }

  const studentAccountId = accountIdForName("student", identity?.fullName ?? dashboardStudent.name);

  return (
    <StudentIdentityProvider row={identity}>
      <div className="flex min-h-screen flex-col bg-ensena-bg-soft lg:flex-row">
        <StudentSidebar />
        <StudentMobileTopbar />
        <main className="min-w-0 flex-1 px-4 py-4 pb-24 sm:px-6 sm:py-6 lg:px-8 lg:py-8 lg:pb-8">
          <div className="mx-auto w-full max-w-[1240px]">
            {/* Always visible, on every student-dashboard page — same
                reasoning as the tutor layout's banner. */}
            <AccountStatusBanner type="student" accountId={studentAccountId} />
            {children}
          </div>
        </main>
        <StudentBottomNav />
      </div>
    </StudentIdentityProvider>
  );
}
