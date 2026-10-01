import type { Metadata } from "next";

import { ForgotPasswordClient } from "./forgot-password-client";

export const metadata: Metadata = {
  title: "Forgot Password | Ensena",
  description: "Reset your Ensena account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
