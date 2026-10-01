"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Logo } from "@/components/logo";
import { endSupabaseSession } from "@/lib/actions/auth";
import { clearAdminSession } from "@/lib/admin-session";
import { clearSession } from "@/lib/session-store";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// Every "Log out" link (SignOutLink) comes here. Signs out of Supabase on
// both the browser and the server (so every sb-… auth cookie is removed),
// clears the app's local student/tutor and admin sessions, then lands on
// /sign-in with a confirmation toast.
export function LogoutClient() {
  const router = useRouter();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      let ok = true;
      if (isSupabaseConfigured()) {
        const [browser, server] = await Promise.allSettled([getSupabaseBrowserClient().auth.signOut(), endSupabaseSession()]);
        ok =
          (browser.status === "fulfilled" && !browser.value.error) ||
          (server.status === "fulfilled" && server.value.ok);
      }
      try {
        clearSession();
        clearAdminSession();
      } catch {
        // Storage blocked — nothing stored to clear.
      }
      if (ok) toast.success("You've been logged out.");
      else toast.error("We couldn't fully log you out. Please close your browser to be safe.");
      router.replace("/sign-in");
      router.refresh();
    })();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ensena-bg-soft px-6">
      <Logo size={48} />
      <p className="flex items-center gap-2 text-sm font-medium text-ensena-muted">
        <Loader2 className="size-4 animate-spin" /> Logging you out…
      </p>
    </div>
  );
}
