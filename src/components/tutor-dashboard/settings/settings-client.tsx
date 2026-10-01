"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useTutorIdentity } from "@/components/tutor-dashboard/tutor-identity";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const tabs = ["Account", "Notifications", "Privacy", "Payments", "Security", "Calendar", "Language", "Theme", "Delete Account"] as const;
type Tab = (typeof tabs)[number];

function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-ensena-border p-3.5">
      <div>
        <p className="text-sm font-medium text-ensena-ink">{label}</p>
        {description && <p className="text-xs text-ensena-muted">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", checked ? "bg-ensena-primary" : "bg-ensena-border")}
      >
        <span className={cn("absolute top-0.5 size-5 rounded-full bg-white transition-transform", checked ? "translate-x-5" : "translate-x-0.5")} />
      </button>
    </div>
  );
}

export function SettingsClient() {
  const [tab, setTab] = useState<Tab>("Account");

  const router = useRouter();
  const me = useTutorIdentity();
  const [name, setName] = useState(me.name);
  const [email, setEmail] = useState(me.email || "adaeze.okonkwo@example.com");
  const [phone, setPhone] = useState(me.id ? me.phone : "+234 801 234 5678");
  const [savingAccount, setSavingAccount] = useState(false);

  async function saveAccount() {
    if (!me.id) {
      toast("Saved for this session (demo mode).");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    setSavingAccount(true);
    const supabase = getSupabaseBrowserClient();
    const [{ error: profileError }, { error: tutorError }] = await Promise.all([
      supabase.from("profiles").update({ full_name: name.trim(), phone: phone.trim() || null }).eq("id", me.id),
      supabase.from("tutor_profiles").update({ phone: phone.trim() || null }).eq("id", me.id),
    ]);
    setSavingAccount(false);
    if (profileError || tutorError) {
      toast.error("We couldn't save your account details. Please try again.");
      return;
    }
    toast.success("Account details saved.");
    router.refresh();
  }

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [marketingNotifs, setMarketingNotifs] = useState(false);

  const [profilePublic, setProfilePublic] = useState(true);
  const [showLastSeen, setShowLastSeen] = useState(true);
  const [allowMessagesFromNewStudents, setAllowMessagesFromNewStudents] = useState(true);

  const [autoWithdraw, setAutoWithdraw] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState("NGN");

  const [twoFactor, setTwoFactor] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const [syncGoogle, setSyncGoogle] = useState(false);
  const [defaultDuration, setDefaultDuration] = useState("60 mins");

  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState<"Light" | "Dark" | "System">("Light");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Re-checks the current password by signing in with it, then sets the new
  // one (Supabase keeps the session). Demo mode just confirms.
  async function changePassword() {
    if (newPassword.length < 6) {
      toast.error("Your new password must be at least 6 characters.");
      return;
    }
    if (!me.id) {
      toast("Password updated (demo mode — nothing was changed).");
      closePasswordModal();
      return;
    }
    setChangingPassword(true);
    const supabase = getSupabaseBrowserClient();
    const { error: checkError } = await supabase.auth.signInWithPassword({ email: me.email, password: currentPassword });
    if (checkError) {
      setChangingPassword(false);
      toast.error("Your current password is incorrect.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPassword(false);
    if (error) {
      toast.error(error.message || "We couldn't change your password. Please try again.");
      return;
    }
    toast.success("Password updated.");
    closePasswordModal();
  }

  function closePasswordModal() {
    setChangePasswordOpen(false);
    setCurrentPassword("");
    setNewPassword("");
  }
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <div>
      <div>
        <h1 className="font-heading text-2xl font-semibold text-ensena-ink">Settings</h1>
        <p className="mt-1 text-sm text-ensena-muted">Manage your account preferences.</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]">
        <div className="flex flex-col gap-1 rounded-2xl border border-ensena-border bg-ensena-surface p-2">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "rounded-xl px-3 py-2 text-left text-sm font-medium",
                tab === t
                  ? "bg-ensena-cta-from/10 text-ensena-cta-to"
                  : t === "Delete Account"
                    ? "text-rose-600 hover:bg-rose-50"
                    : "text-ensena-muted hover:bg-ensena-bg-soft"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-ensena-border bg-ensena-surface p-5">
          {tab === "Account" && (
            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-base font-semibold text-ensena-ink">Account Information</h2>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-xs font-medium text-ensena-muted">Full name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} className="h-10 rounded-lg border border-ensena-border px-3 text-sm" />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-xs font-medium text-ensena-muted">Email address</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} readOnly={!!me.id} className={cn("h-10 rounded-lg border border-ensena-border px-3 text-sm", me.id && "cursor-not-allowed bg-ensena-bg-soft text-ensena-muted")} />
                {me.id && <span className="text-xs text-ensena-muted">To change your sign-in email, please contact Ensena Support.</span>}
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-xs font-medium text-ensena-muted">Phone number</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-10 rounded-lg border border-ensena-border px-3 text-sm" />
              </label>
              <Button onClick={saveAccount} loading={savingAccount} className="mt-2 h-10 w-fit rounded-full bg-ensena-primary px-5 text-sm font-semibold text-white">Save Changes</Button>
            </div>
          )}

          {tab === "Notifications" && (
            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-base font-semibold text-ensena-ink">Notification Preferences</h2>
              <Toggle checked={emailNotifs} onChange={setEmailNotifs} label="Email Notifications" description="Booking requests, messages and reminders" />
              <Toggle checked={smsNotifs} onChange={setSmsNotifs} label="SMS Notifications" description="Get a text before upcoming lessons" />
              <Toggle checked={pushNotifs} onChange={setPushNotifs} label="Push Notifications" description="Browser and mobile push alerts" />
              <Toggle checked={marketingNotifs} onChange={setMarketingNotifs} label="Marketing Emails" description="Product updates and tips from Ensena" />
            </div>
          )}

          {tab === "Privacy" && (
            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-base font-semibold text-ensena-ink">Privacy</h2>
              <Toggle checked={profilePublic} onChange={setProfilePublic} label="Public Profile" description="Make your profile visible to students searching Ensena" />
              <Toggle checked={showLastSeen} onChange={setShowLastSeen} label="Show Last Active Status" />
              <Toggle checked={allowMessagesFromNewStudents} onChange={setAllowMessagesFromNewStudents} label="Allow Messages from New Students" />
            </div>
          )}

          {tab === "Payments" && (
            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-base font-semibold text-ensena-ink">Payment Preferences</h2>
              <Toggle checked={autoWithdraw} onChange={setAutoWithdraw} label="Automatic Weekly Withdrawal" description="Automatically withdraw your available balance every Friday" />
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-xs font-medium text-ensena-muted">Default currency</span>
                <select value={defaultCurrency} onChange={(e) => setDefaultCurrency(e.target.value)} className="h-10 w-48 rounded-lg border border-ensena-border px-3 text-sm">
                  <option value="NGN">Nigerian Naira (₦)</option>
                  <option value="USD">US Dollar ($)</option>
                </select>
              </label>
            </div>
          )}

          {tab === "Security" && (
            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-base font-semibold text-ensena-ink">Security</h2>
              <Toggle checked={twoFactor} onChange={setTwoFactor} label="Two-Factor Authentication" description="Add an extra layer of security to your account" />
              <Toggle checked={loginAlerts} onChange={setLoginAlerts} label="Login Alerts" description="Get notified of new device sign-ins" />
              <Button variant="outline" onClick={() => setChangePasswordOpen(true)} className="mt-2 h-10 w-fit rounded-full border-ensena-border px-5 text-sm font-medium">Change Password</Button>
            </div>
          )}

          {tab === "Calendar" && (
            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-base font-semibold text-ensena-ink">Calendar</h2>
              <Toggle checked={syncGoogle} onChange={setSyncGoogle} label="Sync with Google Calendar" />
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-xs font-medium text-ensena-muted">Default lesson duration</span>
                <select value={defaultDuration} onChange={(e) => setDefaultDuration(e.target.value)} className="h-10 w-48 rounded-lg border border-ensena-border px-3 text-sm">
                  <option>30 mins</option>
                  <option>45 mins</option>
                  <option>60 mins</option>
                  <option>90 mins</option>
                </select>
              </label>
            </div>
          )}

          {tab === "Language" && (
            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-base font-semibold text-ensena-ink">Language</h2>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-xs font-medium text-ensena-muted">Display language</span>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="h-10 w-48 rounded-lg border border-ensena-border px-3 text-sm">
                  <option>English</option>
                  <option>French</option>
                  <option>Igbo</option>
                  <option>Yoruba</option>
                  <option>Hausa</option>
                </select>
              </label>
            </div>
          )}

          {tab === "Theme" && (
            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-base font-semibold text-ensena-ink">Theme</h2>
              <div className="flex gap-2">
                {(["Light", "Dark", "System"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium",
                      theme === t ? "border-ensena-primary bg-ensena-primary/5 text-ensena-ink" : "border-ensena-border text-ensena-muted"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === "Delete Account" && (
            <div className="flex flex-col gap-3">
              <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-rose-600">
                <AlertTriangle className="size-5" /> Delete Account
              </h2>
              <p className="text-sm text-ensena-muted">
                Deleting your account is permanent. You will lose access to your lessons, earnings history and
                student conversations. This cannot be undone.
              </p>
              <Button
                onClick={() => setDeleteOpen(true)}
                className="mt-2 h-10 w-fit rounded-full bg-rose-600 px-5 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Delete My Account
              </Button>
            </div>
          )}
        </div>
      </div>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Confirm Account Deletion">
        {deleteConfirmed ? (
          <p className="text-sm text-ensena-ink">
            Your deletion request has been received. Since this is a demo environment, no account was actually
            deleted.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-ensena-muted">
              Are you sure you want to delete your Ensena tutor account? This action is irreversible.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDeleteOpen(false)} className="h-10 flex-1 rounded-full border-ensena-border text-sm font-medium">
                Cancel
              </Button>
              <Button onClick={() => setDeleteConfirmed(true)} className="h-10 flex-1 rounded-full bg-rose-600 text-sm font-semibold text-white hover:bg-rose-700">
                Yes, Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={changePasswordOpen}
        onClose={closePasswordModal}
        title="Change Password"
      >
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs font-medium text-ensena-muted">Current password</span>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="h-10 rounded-lg border border-ensena-border px-3 text-sm" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs font-medium text-ensena-muted">New password</span>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-10 rounded-lg border border-ensena-border px-3 text-sm" />
          </label>
          <Button
            disabled={!currentPassword || !newPassword}
            loading={changingPassword}
            onClick={changePassword}
            className="mt-1 h-10 w-full rounded-full bg-ensena-primary text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Update Password
          </Button>
        </div>
      </Modal>

    </div>
  );
}
