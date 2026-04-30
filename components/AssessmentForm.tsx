"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SCHEMA, emptyFormValues, type FormValues } from "@/lib/schema";
import { NORTHEAST_REGIONS } from "@/lib/regions";
import FieldRenderer from "./FieldRenderer";
import HelpModal from "./HelpModal";
import HistoryModal from "./HistoryModal";
import AuthBar from "./AuthBar";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type SaveStatus = "idle" | "saving" | "saved" | "error";

const STORAGE_KEY_PREFIX = "fma:";
const storageKey = (regionId: string) => `${STORAGE_KEY_PREFIX}${regionId || "unselected"}`;

type Snapshot = {
  id: string;
  region_id: string;
  values: FormValues;
  status: string;
  edited_by_email: string | null;
  edited_by_name: string | null;
  snapshotted_at: string;
};

export default function AssessmentForm() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editorRegions, setEditorRegions] = useState<string[]>([]);

  const [regionId, setRegionId] = useState<string>("");
  const [values, setValues] = useState<FormValues>(() => emptyFormValues());
  const [status, setStatus] = useState<string>("draft");
  const [lastEditedBy, setLastEditedBy] = useState<{ email: string | null; name: string | null; at: string | null }>({
    email: null,
    name: null,
    at: null,
  });

  const [help, setHelp] = useState<{ open: boolean; title: string; body: string }>({
    open: false,
    title: "",
    body: "",
  });
  const [historyOpen, setHistoryOpen] = useState(false);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const skipNextSave = useRef(false);

  // Track auth state + admin/editor membership
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !user) {
      setIsAdmin(false);
      setEditorRegions([]);
      return;
    }
    (async () => {
      const [{ data: adminRow }, { data: editors }] = await Promise.all([
        supabase.from("admin_emails").select("email").ilike("email", user.email ?? "").maybeSingle(),
        supabase.from("region_editors").select("region_id").ilike("email", user.email ?? ""),
      ]);
      setIsAdmin(Boolean(adminRow));
      setEditorRegions((editors ?? []).map((r: { region_id: string }) => r.region_id));
    })();
  }, [supabase, user]);

  // Load when region changes
  useEffect(() => {
    if (!regionId) return;
    const loadLocal = () => {
      try {
        const raw = localStorage.getItem(storageKey(regionId));
        if (raw) {
          const parsed = JSON.parse(raw);
          skipNextSave.current = true;
          setValues({ ...emptyFormValues(), ...(parsed.values ?? {}) });
          setLastSavedAt(parsed.savedAt ?? null);
          setStatus(parsed.status ?? "draft");
        } else {
          skipNextSave.current = true;
          setValues(emptyFormValues());
          setLastSavedAt(null);
          setStatus("draft");
        }
        setLastEditedBy({ email: null, name: null, at: null });
      } catch {
        skipNextSave.current = true;
        setValues(emptyFormValues());
      }
    };

    if (user && supabase) {
      setLoading(true);
      supabase
        .from("regional_plans")
        .select("values, status, updated_at, last_edited_by_email, last_edited_by_name")
        .eq("region_id", regionId)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error || !data) {
            loadLocal();
          } else {
            skipNextSave.current = true;
            setValues({ ...emptyFormValues(), ...(data.values as FormValues) });
            setLastSavedAt(data.updated_at);
            setStatus(data.status ?? "draft");
            setLastEditedBy({
              email: data.last_edited_by_email,
              name: data.last_edited_by_name,
              at: data.updated_at,
            });
          }
          setLoading(false);
        });
    } else {
      loadLocal();
    }
  }, [regionId, user, supabase]);

  // Autosave (debounced)
  useEffect(() => {
    if (!regionId) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    setSaveStatus("saving");
    const t = setTimeout(async () => {
      const savedAt = new Date().toISOString();
      try {
        localStorage.setItem(
          storageKey(regionId),
          JSON.stringify({ regionId, values, savedAt, status })
        );
        if (user && supabase && (isAdmin || editorRegions.includes(regionId))) {
          const region = NORTHEAST_REGIONS.find((r) => r.id === regionId);
          const { error } = await supabase.from("regional_plans").upsert(
            {
              user_id: user.id,
              region_id: regionId,
              region_name: region?.name ?? regionId,
              values,
              status,
              last_edited_by_email: user.email,
              last_edited_by_name: user.email,
            },
            { onConflict: "region_id" }
          );
          if (error) throw error;
          setLastEditedBy({ email: user.email ?? null, name: user.email ?? null, at: savedAt });
        }
        setLastSavedAt(savedAt);
        setSaveStatus("saved");
      } catch (e) {
        console.error(e);
        setSaveStatus("error");
      }
    }, 700);
    return () => clearTimeout(t);
  }, [values, regionId, user, supabase, status, isAdmin, editorRegions]);

  const onChange = useCallback((id: string, value: string | string[] | number) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const openHelp = useCallback((title: string, body: string) => {
    setHelp({ open: true, title, body });
  }, []);

  const region = useMemo(() => NORTHEAST_REGIONS.find((r) => r.id === regionId), [regionId]);

  const downloadJson = () => {
    const payload = {
      regionId,
      regionName: region?.name ?? "",
      savedAt: new Date().toISOString(),
      status,
      values,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `final-mile-${regionId || "draft"}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uploadJson: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed.regionId && typeof parsed.regionId === "string") setRegionId(parsed.regionId);
        if (parsed.values) setValues({ ...emptyFormValues(), ...parsed.values });
        if (parsed.status) setStatus(parsed.status);
      } catch {
        alert("Could not parse that file. Make sure it's a JSON export from this tool.");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  const submitPlan = async () => {
    if (!regionId) return;
    if (!confirm("Mark this plan as Submitted? You can still edit it after submitting.")) return;
    setStatus("submitted");
    if (user && supabase) {
      await supabase
        .from("regional_plans")
        .update({ status: "submitted", submitted_at: new Date().toISOString() })
        .eq("region_id", regionId);
    }
  };

  const printPdf = () => window.print();

  const openHistory = async () => {
    if (!user || !supabase) {
      alert("Sign in to view history.");
      return;
    }
    setHistoryOpen(true);
    setLoadingHistory(true);
    const { data } = await supabase
      .from("plan_history")
      .select("*")
      .eq("region_id", regionId)
      .order("snapshotted_at", { ascending: false })
      .limit(50);
    setSnapshots((data as Snapshot[]) ?? []);
    setLoadingHistory(false);
  };

  const restoreSnapshot = (snap: Snapshot) => {
    setValues({ ...emptyFormValues(), ...snap.values });
    setStatus(snap.status);
  };

  const canEdit = isAdmin || editorRegions.includes(regionId);
  const completedFields = useMemo(() => {
    let count = 0,
      total = 0;
    SCHEMA.forEach((s) =>
      s.subsections.forEach((sub) =>
        sub.fields.forEach((f) => {
          if (f.type === "triple") {
            for (const n of [1, 2, 3]) {
              total++;
              if (((values as Record<string, unknown>)[`${f.id}_${n}`] as string) ?? "") count++;
            }
          } else {
            total++;
            const v = values[f.id];
            if (Array.isArray(v) ? v.length > 0 : v !== "" && v !== undefined && v !== null) count++;
          }
        })
      )
    );
    return { count, total, pct: total ? Math.round((count / total) * 100) : 0 };
  }, [values]);

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <header className="app-hero relative overflow-hidden border-b border-ink/30 bg-ink text-white shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-arc-red via-arc-red to-arc-red/60" />
        <div className="mx-auto max-w-5xl px-5 py-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-2xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Northeast Division · American Red Cross
              </div>
              <h1 className="mt-1 text-[26px] font-bold leading-tight tracking-tight">
                Final Mile Assessment
              </h1>
              <p className="mt-1 max-w-2xl text-[13.5px] text-white/70">
                Regional Template · Plans due <strong className="text-white">June 15, 2026</strong> · Implementation begins July 1, 2026
              </p>
            </div>
            <div className="flex items-center gap-2 no-print">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/15"
                >
                  Division Admin →
                </Link>
              )}
              <button
                onClick={() =>
                  openHelp(
                    "About this template",
                    `WHAT THIS IS\nThis template captures each Region's plan to meet the Northeast Division Final Mile readiness standard: 2-hour mobilization and 4-hour shelter establishment for Level 1–3 events.\n\nHOW TO USE IT\nPick your region, work through the 12 sections, click the ? on any field for guidance. Progress autosaves to your browser as you type, and to the cloud when you sign in.\n\nMULTIPLE EDITORS\nMore than one person from your region can edit the same plan — they just need to sign in with their Red Cross email. Last edit wins; every save is snapshotted to history (the History button) so nothing is permanently lost.\n\nDOWNLOAD / PRINT\nUse Download to grab a JSON copy, or Print to generate a PDF (all sections expand for print).\n\nSUBMIT\nWhen the plan is ready for division review, click Submit. You can still edit after submitting.`
                  )
                }
                className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/15"
              >
                ? About
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <label className="mb-1.5 block text-2xs font-semibold uppercase tracking-wider text-white/60">
                Region
              </label>
              <select
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                className="w-full max-w-md rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-[15px] text-white shadow-sm backdrop-blur focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 [&>option]:text-ink"
              >
                <option value="">Select your region…</option>
                {NORTHEAST_REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col items-end gap-2">
              <AuthBar compact />
            </div>
          </div>
        </div>
      </header>

      {/* TOOLBAR */}
      {regionId && (
        <div className="no-print sticky top-0 z-30 border-b border-line bg-surface/85 backdrop-blur shadow-sm">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-5 py-2.5">
            <div className="flex items-center gap-2 text-xs">
              <SaveBadge status={saveStatus} loading={loading} lastSavedAt={lastSavedAt} planStatus={status} />
              {lastEditedBy.email && (
                <span className="hidden items-center gap-1 text-2xs text-muted md:inline-flex">
                  <span className="text-line-strong">·</span>
                  Last edit by <span className="font-medium text-ink-soft">{lastEditedBy.email}</span>
                </span>
              )}
              <span className="text-line-strong">·</span>
              <span className="text-2xs text-muted">
                {completedFields.count}/{completedFields.total} fields ({completedFields.pct}%)
              </span>
            </div>
            <div className="ml-auto flex flex-wrap gap-1.5">
              <ToolbarButton onClick={downloadJson}>Download</ToolbarButton>
              <ToolbarButton onClick={() => fileInputRef.current?.click()}>Upload</ToolbarButton>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                onChange={uploadJson}
                className="hidden"
              />
              <ToolbarButton onClick={printPdf}>Print / PDF</ToolbarButton>
              <ToolbarButton onClick={openHistory} disabled={!user}>
                History
              </ToolbarButton>
              <button
                onClick={submitPlan}
                disabled={!canEdit}
                className="rounded-md bg-arc-green px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50"
              >
                {status === "submitted" ? "Resubmit" : "Submit plan"}
              </button>
            </div>
          </div>
          <div className="h-1 w-full bg-line/60">
            <div
              className="h-full bg-gradient-to-r from-arc-red to-accent transition-all duration-500"
              style={{ width: `${completedFields.pct}%` }}
            />
          </div>
        </div>
      )}

      {/* BODY */}
      <main className="mx-auto max-w-5xl px-5 py-6">
        {!regionId && (
          <div className="rounded-2xl border border-arc-amber/30 bg-arc-amber-soft px-5 py-6 text-[15px] text-arc-amber">
            <div className="font-semibold">Pick your region above to begin.</div>
            <p className="mt-1 text-sm text-arc-amber/90">
              Your answers autosave to this browser as you type. Sign in with your Red Cross email to also save to the cloud and collaborate with co-editors in your region.
            </p>
          </div>
        )}

        {regionId && !user && (
          <div className="mb-4 rounded-2xl border border-line bg-surface px-5 py-4 shadow-card">
            <div className="text-sm font-semibold text-ink">Working locally</div>
            <p className="mt-0.5 text-sm text-muted">
              You're not signed in, so your answers stay in this browser only. Sign in (top right) to sync to the cloud and let co-editors see your progress.
            </p>
          </div>
        )}

        {regionId && user && !canEdit && (
          <div className="mb-4 rounded-2xl border border-arc-red/30 bg-arc-red-soft px-5 py-4 text-sm text-arc-red">
            You don't have edit access to <strong>{region?.name}</strong>. Ask the division admin to add{" "}
            <code className="rounded bg-white px-1">{user.email}</code> as an editor.
          </div>
        )}

        {regionId && (
          <div className="hidden print-show print:mb-6 print:block">
            <h1 className="text-2xl font-bold">Final Mile Assessment — {region?.name}</h1>
            <p className="text-sm text-muted">
              Northeast Division · Generated {new Date().toLocaleDateString()} · Status: {status}
            </p>
          </div>
        )}

        {regionId && (
          <div className="space-y-3">
            {SCHEMA.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                values={values}
                onChange={onChange}
                onHelp={openHelp}
                defaultOpen={section.number === 1}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="mx-auto max-w-5xl px-5 pb-10 pt-4 text-2xs text-muted">
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
          <span>Northeast Division Final Mile Readiness Assessment · Regional Template</span>
          <span>
            <a href="https://lastmile.jbf.com" className="hover:text-ink">
              lastmile.jbf.com
            </a>
          </span>
        </div>
      </footer>

      <HelpModal
        open={help.open}
        title={help.title}
        body={help.body}
        onClose={() => setHelp({ ...help, open: false })}
      />
      <HistoryModal
        open={historyOpen}
        snapshots={snapshots}
        loading={loadingHistory}
        onClose={() => setHistoryOpen(false)}
        onRestore={restoreSnapshot}
      />
    </div>
  );
}

function SaveBadge({
  status,
  loading,
  lastSavedAt,
  planStatus,
}: {
  status: SaveStatus;
  loading: boolean;
  lastSavedAt: string | null;
  planStatus: string;
}) {
  if (loading) {
    return <Pill tone="muted">Loading…</Pill>;
  }
  if (status === "saving") return <Pill tone="muted">Saving…</Pill>;
  if (status === "error") return <Pill tone="red">Save failed</Pill>;
  if (planStatus === "submitted") return <Pill tone="green">Submitted</Pill>;
  if (lastSavedAt)
    return (
      <Pill tone="muted">
        Saved {new Date(lastSavedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </Pill>
    );
  return <Pill tone="muted">Draft</Pill>;
}

function Pill({ tone, children }: { tone: "muted" | "red" | "green"; children: React.ReactNode }) {
  const cls = {
    muted: "border-line bg-bg text-muted",
    red: "border-arc-red/20 bg-arc-red-soft text-arc-red",
    green: "border-arc-green/20 bg-arc-green-soft text-arc-green",
  }[tone];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-2xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

function ToolbarButton({
  onClick,
  children,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft shadow-sm hover:border-line-strong hover:bg-bg disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function SectionCard({
  section,
  values,
  onChange,
  onHelp,
  defaultOpen,
}: {
  section: (typeof SCHEMA)[number];
  values: FormValues;
  onChange: (id: string, value: string | string[] | number) => void;
  onHelp: (title: string, body: string) => void;
  defaultOpen?: boolean;
}) {
  // Compute completion for this section
  const stat = useMemo(() => {
    let total = 0,
      filled = 0;
    section.subsections.forEach((sub) =>
      sub.fields.forEach((f) => {
        if (f.type === "triple") {
          for (const n of [1, 2, 3]) {
            total++;
            if (((values as Record<string, unknown>)[`${f.id}_${n}`] as string) ?? "") filled++;
          }
        } else {
          total++;
          const v = values[f.id];
          if (Array.isArray(v) ? v.length > 0 : v !== "" && v !== undefined && v !== null) filled++;
        }
      })
    );
    return { total, filled };
  }, [section, values]);

  return (
    <details
      className="card section-stripe relative overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition open:shadow-cardHover"
      open={defaultOpen}
    >
      <summary className="accordion-summary group flex cursor-pointer items-start justify-between gap-4 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-arc-red/10 text-sm font-bold text-arc-red">
            {section.number}
          </div>
          <div>
            <h2 className="text-[17px] font-semibold leading-tight text-ink">{section.title}</h2>
            {section.objective && (
              <div className="mt-0.5 text-[13px] text-muted">{section.objective}</div>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden text-2xs font-medium text-muted sm:inline-block">
            {stat.filled}/{stat.total}
          </span>
          {section.help && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onHelp(section.title, section.help!);
              }}
              className="no-print rounded-full border border-line px-2.5 py-0.5 text-2xs font-medium text-muted hover:border-accent hover:bg-accent-soft hover:text-accent"
            >
              Help
            </button>
          )}
          <svg
            className="chev h-5 w-5 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </summary>
      <div className="accordion-body space-y-7 border-t border-line bg-surface px-5 py-5">
        {section.intro && (
          <div className="rounded-lg bg-bg px-4 py-3 text-[13.5px] leading-relaxed text-ink-soft">
            {section.intro}
          </div>
        )}
        {section.subsections.map((sub, idx) => (
          <div key={`${sub.title}-${idx}`} className="space-y-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-arc-red">
                {sub.title}
              </div>
              {sub.description && (
                <p className="mt-1 text-sm text-muted">{sub.description}</p>
              )}
            </div>
            <div className="space-y-5">
              {sub.fields.map((field) => (
                <FieldRenderer
                  key={field.id}
                  field={field}
                  values={values}
                  onChange={onChange}
                  onHelp={onHelp}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}
