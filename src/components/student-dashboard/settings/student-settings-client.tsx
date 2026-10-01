"use client";

import { type ComponentType, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Calendar,
  ChevronRight,
  CreditCard,
  IdCard,
  Lock,
  ShieldCheck,
  SlidersHorizontal,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { saveStudentIdentity, useStudentIdentity } from "@/components/student-dashboard/student-identity";
import { dashboardStudent, studentProfileDetail } from "@/lib/student-dashboard-data";
import { cn } from "@/lib/utils";

const tabs = ["Account", "Notifications", "Privacy", "Security", "Payment Methods", "Calendar Sync", "Theme", "Delete Account"] as const;
type Tab = (typeof tabs)[number];

// Case-insensitive so a link like Profile's "Payment" card (?tab=Payment
// Methods) always lands on the right tab.
function resolveTab(raw: string | null): Tab {
  if (!raw) return "Account";
  const normalized = raw.trim().toLowerCase();
  const match = tabs.find((t) => t.toLowerCase() === normalized);
  return match ?? "Account";
}

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

// Mobile-only entry point: a settings row not backed by a desktop sidebar
// tab. Kept separate from `Tab` so the desktop sidebar/tab list is untouched.
type MobilePanel = Tab | "Personal Details";

type MobileRow = {
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  panel: MobilePanel;
};

type MobileGroup = {
  title: string;
  icon: ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  rowIconBg: string;
  rowIconColor: string;
  rows: MobileRow[];
};

export function StudentSettingsClient() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [tab, setTab] = useState<Tab>(() => resolveTab(tabParam));
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>(() => resolveTab(tabParam));
  const [mobileView, setMobileView] = useState<"list" | "detail">(() => (tabParam ? "detail" : "list"));

  // Keep in sync with links that navigate here with a different `?tab=`
  // while already on this route (e.g. Profile > Payment). Adjusted during
  // render rather than in a useEffect — React's recommended pattern for
  // "derive state from a changed prop".
  const [prevTabParam, setPrevTabParam] = useState(tabParam);
  if (tabParam !== prevTabParam) {
    setPrevTabParam(tabParam);
    const resolved = resolveTab(tabParam);
    setTab(resolved);
    setMobilePanel(resolved);
    setMobileView("detail");
  }
  const router = useRouter();
  const me = useStudentIdentity();
  const [email, setEmail] = useState(me.email);
  const [phone, setPhone] = useState(me.phone);
  const [accountSaved, setAccountSaved] = useState(false);

  async function saveAccount() {
    const { ok } = await saveStudentIdentity(me.id, { profile: { phone: phone.trim() || null }, student: { phone: phone.trim() || null } });
    if (!ok) return;
    if (me.id) router.refresh();
    dashboardStudent.email = email;
    dashboardStudent.phone = phone;
    setAccountSaved(true);
    setTimeout(() => setAccountSaved(false), 2000);
  }

  const [dob, setDob] = useState(me.dob);
  const [academicLevel, setAcademicLevel] = useState(me.level);
  const [timezone, setTimezone] = useState(studentProfileDetail.timezone);
  const [preferredLanguage, setPreferredLanguage] = useState(studentProfileDetail.preferredLanguage);
  const [emergencyContact, setEmergencyContact] = useState(studentProfileDetail.emergencyContact);
  const [personalSaved, setPersonalSaved] = useState(false);

  async function savePersonalDetails() {
    const { ok } = await saveStudentIdentity(me.id, {
      profile: { date_of_birth: dob || null },
      student: { date_of_birth: dob || null, academic_detail: academicLevel.trim() || null },
    });
    if (!ok) return;
    if (me.id) router.refresh();
    dashboardStudent.dob = dob;
    dashboardStudent.level = academicLevel;
    studentProfileDetail.timezone = timezone;
    studentProfileDetail.preferredLanguage = preferredLanguage;
    studentProfileDetail.emergencyContact = emergencyContact;
    setPersonalSaved(true);
    setTimeout(() => setPersonalSaved(false), 2000);
  }

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);

  const [profilePublic, setProfilePublic] = useState(false);
  const [shareProgressWithParent, setShareProgressWithParent] = useState(true);

  const [twoFactor, setTwoFactor] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const [syncGoogle, setSyncGoogle] = useState(false);
  const [theme, setTheme] = useState<"Light" | "Dark" | "System">("Light");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  function flash(message: string) {
    setToast(message);
    setTimeout(() => setToast((cur) => (cur === message ? null : cur)), 2500);
  }
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  function openMobilePanel(panel: MobilePanel) {
    setMobilePanel(panel);
    setMobileView("detail");
    if (panel !== "Personal Details") setTab(panel);
  }

  function renderTabContent(t: Tab) {
    switch (t) {
      case "Account":
        return (
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-base font-semibold text-ensena-ink">Account Information</h2>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-xs font-medium text-ensena-muted">Full name</span>
              <input
                value={me.name}
                readOnly
                disabled
                className="h-10 cursor-not-allowed rounded-lg border border-ensena-border bg-ensena-bg-soft px-3 text-sm text-ensena-muted"
              />
              <span className="text-xs text-ensena-muted">To correct your name, please contact Ensena Support.</span>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-xs font-medium text-ensena-muted">Email address</span>
              {me.id ? (
                <>
                  <input value={email} readOnly disabled className="h-10 cursor-not-allowed rounded-lg border border-ensena-border bg-ensena-bg-soft px-3 text-sm text-ensena-muted" />
                  <span className="text-xs text-ensena-muted">To change your sign-in email, please contact Ensena Support.</span>
                </>
              ) : (
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 rounded-lg border border-ensena-border px-3 text-sm" />
              )}
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-xs font-medium text-ensena-muted">Phone number</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-10 rounded-lg border border-ensena-border px-3 text-sm" />
            </label>
            <Button onClick={saveAccount} className="mt-2 h-10 w-fit rounded-full bg-ensena-primary px-5 text-sm font-semibold text-white">
              {accountSaved ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        );

      case "Notifications":
        return (
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-base font-semibold text-ensena-ink">Notification Preferences</h2>
            <Toggle checked={emailNotifs} onChange={setEmailNotifs} label="Email Notifications" description="Booking confirmations, homework and reminders" />
            <Toggle checked={smsNotifs} onChange={setSmsNotifs} label="SMS Notifications" description="Get a text before upcoming lessons" />
            <Toggle checked={pushNotifs} onChange={setPushNotifs} label="Push Notifications" description="Browser and mobile push alerts" />
          </div>
        );

      case "Privacy":
        return (
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-base font-semibold text-ensena-ink">Privacy</h2>
            <Toggle checked={profilePublic} onChange={setProfilePublic} label="Public Profile" description="Allow tutors to see your profile before booking" />
            <Toggle
              checked={shareProgressWithParent}
              onChange={setShareProgressWithParent}
              label="Share Progress with Parent"
              description="Your linked parent account can view your progress reports"
            />
          </div>
        );

      case "Security":
        return (
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-base font-semibold text-ensena-ink">Security</h2>
            <Toggle checked={twoFactor} onChange={setTwoFactor} label="Two-Factor Authentication" description="Add an extra layer of security to your account" />
            <Toggle checked={loginAlerts} onChange={setLoginAlerts} label="Login Alerts" description="Get notified of new device sign-ins" />
            <Button variant="outline" onClick={() => setChangePasswordOpen(true)} className="mt-2 h-10 w-fit rounded-full border-ensena-border px-5 text-sm font-medium">
              Change Password
            </Button>
          </div>
        );

      case "Payment Methods":
        return (
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-base font-semibold text-ensena-ink">Payment Methods</h2>
            <p className="text-sm text-ensena-muted">No saved payment methods yet. Add one during your next booking.</p>
            <Button variant="outline" onClick={() => flash("Payment methods are added during checkout on your next booking.")} className="h-10 w-fit rounded-full border-ensena-border px-5 text-sm font-medium">
              Add Payment Method
            </Button>
          </div>
        );

      case "Calendar Sync":
        return (
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-base font-semibold text-ensena-ink">Calendar Sync</h2>
            <Toggle checked={syncGoogle} onChange={setSyncGoogle} label="Sync with Google Calendar" description="Automatically add lessons to your calendar" />
          </div>
        );

      case "Theme":
        return (
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
        );

      case "Delete Account":
        return (
          <div className="flex flex-col gap-3">
            <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-rose-600">
              <AlertTriangle className="size-5" /> Delete Account
            </h2>
            <p className="text-sm text-ensena-muted">
              Deleting your account is permanent. You will lose access to your lessons, homework and messages. This cannot be undone.
            </p>
            <Button onClick={() => setDeleteOpen(true)} className="mt-2 h-10 w-fit rounded-full bg-rose-600 px-5 text-sm font-semibold text-white hover:bg-rose-700">
              Delete My Account
            </Button>
          </div>
        );
    }
  }

  function renderPersonalDetails() {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-base font-semibold text-ensena-ink">Personal Details</h2>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs font-medium text-ensena-muted">Date of birth</span>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="h-10 rounded-lg border border-ensena-border px-3 text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs font-medium text-ensena-muted">Academic level</span>
          <input value={academicLevel} onChange={(e) => setAcademicLevel(e.target.value)} className="h-10 rounded-lg border border-ensena-border px-3 text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs font-medium text-ensena-muted">Timezone</span>
          <input value={timezone} onChange={(e) => setTimezone(e.target.value)} className="h-10 rounded-lg border border-ensena-border px-3 text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs font-medium text-ensena-muted">Preferred language</span>
          <input
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value)}
            className="h-10 rounded-lg border border-ensena-border px-3 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs font-medium text-ensena-muted">Emergency contact</span>
          <input
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
            className="h-10 rounded-lg border border-ensena-border px-3 text-sm"
          />
        </label>
        <Button onClick={savePersonalDetails} className="mt-2 h-10 w-fit rounded-full bg-ensena-primary px-5 text-sm font-semibold text-white">
          {personalSaved ? "Saved!" : "Save Changes"}
        </Button>
      </div>
    );
  }

  const mobileGroups: MobileGroup[] = [
    {
      title: "Account",
      icon: User,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-500",
      rowIconBg: "bg-rose-50",
      rowIconColor: "text-rose-500",
      rows: [
        { label: "Account Information", description: "View and manage your account details.", icon: User, panel: "Account" },
        { label: "Personal Details", description: "Manage your profile and personal information.", icon: IdCard, panel: "Personal Details" },
      ],
    },
    {
      title: "Preferences",
      icon: SlidersHorizontal,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-500",
      rowIconBg: "bg-violet-50",
      rowIconColor: "text-violet-500",
      rows: [
        { label: "Notifications", description: "Manage your notification preferences.", icon: Bell, panel: "Notifications" },
        { label: "Privacy", description: "Manage your privacy settings.", icon: Lock, panel: "Privacy" },
        { label: "Calendar Sync", description: "Sync your classes with your calendar.", icon: Calendar, panel: "Calendar Sync" },
        { label: "Theme", description: "Choose your preferred app theme.", icon: SlidersHorizontal, panel: "Theme" },
      ],
    },
    {
      title: "Payments",
      icon: CreditCard,
      iconBg: "bg-sky-50",
      iconColor: "text-sky-500",
      rowIconBg: "bg-sky-50",
      rowIconColor: "text-sky-500",
      rows: [{ label: "Payment Methods", description: "Manage your saved payment methods.", icon: CreditCard, panel: "Payment Methods" }],
    },
    {
      title: "Security",
      icon: ShieldCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      rowIconBg: "bg-emerald-50",
      rowIconColor: "text-emerald-600",
      rows: [{ label: "Password & Security", description: "Update your password and security settings.", icon: Lock, panel: "Security" }],
    },
  ];

  const mobilePanelLabel =
    mobilePanel === "Personal Details"
      ? "Personal Details"
      : mobileGroups.flatMap((g) => g.rows).find((r) => r.panel === mobilePanel)?.label ?? mobilePanel;

  return (
    <div>
      {mobileView === "list" && (
        <div className="lg:hidden">
          <h1 className="font-heading text-2xl font-semibold text-ensena-ink">Settings</h1>
          <p className="mt-1 text-sm text-ensena-muted">Manage your account preferences.</p>
        </div>
      )}
      <div className="hidden lg:block">
        <h1 className="font-heading text-2xl font-semibold text-ensena-ink">Settings</h1>
        <p className="mt-1 text-sm text-ensena-muted">Manage your account preferences.</p>
      </div>

      {/* Desktop: unchanged sidebar + content panel */}
      <div className="mt-6 hidden gap-5 lg:grid lg:grid-cols-[220px_1fr]">
        <div className="flex flex-col gap-1 rounded-2xl border border-ensena-border bg-ensena-surface p-2">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "rounded-xl px-3 py-2 text-left text-sm font-medium",
                tab === t
                  ? "bg-ensena-primary/10 text-ensena-primary"
                  : t === "Delete Account"
                    ? "text-rose-600 hover:bg-rose-50"
                    : "text-ensena-muted hover:bg-ensena-bg-soft"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-ensena-border bg-ensena-surface p-5">{renderTabContent(tab)}</div>
      </div>

      {/* Mobile: compact grouped rows, each opening as a full-screen panel */}
      <div className="mt-5 lg:hidden">
        {mobileView === "list" ? (
          <div className="flex flex-col gap-5">
            {mobileGroups.map((group) => (
              <div key={group.title} className="overflow-hidden rounded-2xl border border-ensena-border bg-ensena-surface">
                <div className="flex items-center justify-between px-4 py-3.5">
                  <h2 className="font-heading text-sm font-semibold text-ensena-ink">{group.title}</h2>
                  <span className={cn("flex size-9 items-center justify-center rounded-full", group.iconBg)}>
                    <group.icon className={cn("size-4", group.iconColor)} />
                  </span>
                </div>
                <div className="border-t border-ensena-border">
                  {group.rows.map((row, i) => (
                    <button
                      key={row.label}
                      type="button"
                      onClick={() => openMobilePanel(row.panel)}
                      className={cn("flex w-full items-center gap-3 px-4 py-3.5 text-left", i > 0 && "border-t border-ensena-border")}
                    >
                      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", group.rowIconBg)}>
                        <row.icon className={cn("size-4", group.rowIconColor)} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-ensena-ink">{row.label}</span>
                        <span className="block text-xs text-ensena-muted">{row.description}</span>
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-ensena-muted" />
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
              <h2 className="font-heading text-sm font-semibold text-rose-600">Danger Zone</h2>
              <div className="my-3 border-t border-rose-200" />
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-rose-600">Delete Account</p>
                  <p className="text-xs text-ensena-muted">Permanently delete your Ensena account and all associated data.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteOpen(true)}
                  className="shrink-0 rounded-lg border border-rose-600 px-4 py-2 text-sm font-semibold text-rose-600"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-ensena-border bg-ensena-surface p-4">
            <button type="button" onClick={() => setMobileView("list")} className="mb-4 flex items-center gap-2 text-sm font-medium text-ensena-ink">
              <ArrowLeft className="size-4" /> {mobilePanelLabel}
            </button>
            {mobilePanel === "Personal Details" ? renderPersonalDetails() : renderTabContent(mobilePanel)}
          </div>
        )}
      </div>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Confirm Account Deletion">
        {deleteConfirmed ? (
          <p className="text-sm text-ensena-ink">Your deletion request has been received. Since this is a demo environment, no account was actually deleted.</p>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-ensena-muted">Are you sure you want to delete your Ensena student account? This action is irreversible.</p>
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
        onClose={() => {
          setChangePasswordOpen(false);
          setCurrentPassword("");
          setNewPassword("");
        }}
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
            onClick={() => {
              setChangePasswordOpen(false);
              setCurrentPassword("");
              setNewPassword("");
              flash("Password updated. (Demo environment: no real credential was changed.)");
            }}
            className="mt-1 h-10 w-full rounded-full bg-ensena-primary text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Update Password
          </Button>
        </div>
      </Modal>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ensena-ink px-4 py-2 text-sm text-white shadow-lg">{toast}</div>
      )}
    </div>
  );
}
