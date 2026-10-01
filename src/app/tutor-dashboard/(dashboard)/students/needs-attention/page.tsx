import type { Metadata } from "next";

import { NeedsAttentionClient } from "@/components/tutor-dashboard/students/needs-attention-client";

export const metadata: Metadata = {
  title: "Needs Attention | Ensena Tutor Dashboard",
};

export default function NeedsAttentionPage() {
  return <NeedsAttentionClient />;
}
