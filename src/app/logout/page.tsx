import type { Metadata } from "next";

import { LogoutClient } from "./logout-client";

export const metadata: Metadata = {
  title: "Logging out | Ensena",
  robots: { index: false },
};

export default function LogoutPage() {
  return <LogoutClient />;
}
