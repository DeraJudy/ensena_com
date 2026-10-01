import type { Metadata } from "next";
import { Suspense } from "react";

import { MyProfileClient } from "@/components/tutor-dashboard/profile/my-profile-client";

export const metadata: Metadata = {
  title: "My Profile | Ensena Tutor Dashboard",
};

export default function MyProfilePage() {
  return (
    <Suspense fallback={null}>
      <MyProfileClient />
    </Suspense>
  );
}
