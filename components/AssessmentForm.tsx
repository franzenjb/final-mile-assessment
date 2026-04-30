"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SCHEMA, emptyFormValues, type FormValues } from "@/lib/schema";
import { NORTHEAST_REGIONS } from "@/lib/regions";
import FieldRenderer from "./FieldRenderer";
import HelpModal from "./HelpModal";
import AuthBar from "./AuthBar";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type SaveStatus = "idle" | "saving" | "saved" | "error";

const STORAGE_KEY_PREFIX = "fma:";
const storageKey = (regionId: string) =>
  `${STORAGE_KEY_PREFIX}${regionId || "unselected"}`;

export default function AssessmentForm() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [user, setUser] = useState<User | null>(null);
  const [regionId, setRegionId] = useState<string>("");
  const [values, setValues] = useState<FormValues>(() => emptyFormValues());
  const [status, setStatus] = useState<string>("draft");
  const [help, setHelp] = useState<{ open: boolean; title: string; body: string }>({
    open: false,
    title: "",
    body: "",
  });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const skipNextSave = useRef(false);

  // Track auth state
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  // Load when region or user changes
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
      } catch {
        skipNextSave.current = true;
        setValues(emptyFormValues());
      }
    };

    if (user && supabase) {
      setLoading(true);
      supabase
        .from("regional_plans")
        .select("values, status, updated_at")
        .eq("user_id", user.id)
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
        // local backup always
        localStorage.setItem(
          storageKey(regionId),
          JSON.stringify({ regionId, values, savedAt, status })
        );
        // cloud if signed in
        if (user && supabase) {
          const region = NORTHEAST_REGIONS.find((r) => r.id === regionId);
          const { error } = await supabase.from("regional_plans").upsert(
            {
              user_id: user.id,
              region_id: regionId,
              region_name: region?.name ?? regionId,
              values,
              status,
            },
            { onConflict: "user_id,region_id" }
          );
          if (error) throw error;
        }
        setLastSavedAt(savedAt);
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    }, 600);
    return () => clearTimeout(t);
  }, [values, regionId, user, supabase, status]);

  const onChange = useCallback((id: string, value: string | string[] | number) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const openHelp = useCallback((title: string, body: string) => {
    setHelp({ open: true, title, body });
  }, []);

  const region = useMemo(
    () => NORTHEAST_REGIONS.find((r) => r.id === regionId),
    [regionId]
  );

  const downloadJson = () => {
    const payload = {
      regionId,
      regionName: region?.name ?? "",
      savedAt: new Date().toISOString(),
      status,
      values,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const slug = regionId || "draft";
    a.download = `final-mile-${slug}-${new Date().toISOString().slice(0, 10)}.json`;
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
        if (parsed.regionId && typeof parsed.regionId === "string") {
          setRegionId(parsed.regionId);
        }
        if (parsed.values) {
          skipNextSave.current = false;
          setValues({ ...emptyFormValues(), ...parsed.values });
        }
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
        .eq("user_id", user.id)
        .eq("region_id", regionId);
    }
  };

  const printPdf = () => window.print();

  const clearForm = () => {
    if (!confirm("Clear all answers for this region in this browser? Cloud copy is unaffected.")) return;
    skipNextSave.current = true;
    setValues(emptyFormValues());
    localStorage.removeItem(storageKey(regionId));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <header className="no-print mb-6 space-y-3 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-arc-ink">
              Final Mile Assessment — Regional Template
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Northeast Division · Plans due June 15, 2026 · Implementation begins July 1, 2026
            </p>
          </div>
          <button
            onClick={() =>
              openHelp(
                "About this template",
                "This template captures each Region's plan to meet the Northeast Division Final Mile readiness standard (2-hour mobilization / 4-hour shelter establishment for Level 3 and below events).\n\nProgress autosaves to your browser as you type. Sign in with your work email and your answers also sync to the cloud, so you can pick up on another device.\n\nUse Download to export your answers, Print to generate a PDF, and Submit when your plan is ready for division review."
              )
            }
            className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            ? About
          </button>
        </div>

        <AuthBar />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-arc-ink">Region</label>
            <select
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-arc-blue focus:outline-none focus:ring-1 focus:ring-arc-blue"
            >
              <option value="">Select your region…</option>
              {NORTHEAST_REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end justify-end gap-2 text-xs text-gray-500">
            {regionId && (
              <span>
                {loading && "Loading…"}
                {!loading && saveStatus === "saving" && "Saving…"}
                {!loading && saveStatus === "saved" && lastSavedAt && (
                  <>Saved {new Date(lastSavedAt).toLocaleTimeString()}</>
                )}
                {!loading && saveStatus === "error" && (
                  <span className="text-red-600">Save failed</span>
                )}
                {status === "submitted" && (
                  <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-green-800">
                    Submitted
                  </span>
                )}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={downloadJson}
            disabled={!regionId}
            className="rounded-md bg-arc-blue px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
          >
            Download JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Upload JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={uploadJson}
            className="hidden"
          />
          <button
            onClick={printPdf}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Print / Save as PDF
          </button>
          <button
            onClick={submitPlan}
            disabled={!regionId || !user}
            title={!user ? "Sign in to submit" : ""}
            className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
          >
            {status === "submitted" ? "Resubmit" : "Submit plan"}
          </button>
          <button
            onClick={clearForm}
            disabled={!regionId}
            className="ml-auto rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Clear local
          </button>
        </div>
      </header>

      <div className="hidden print:mb-4 print:block">
        <h1 className="text-xl font-bold">Final Mile Assessment — {region?.name ?? "Draft"}</h1>
        <p className="text-sm text-gray-600">
          Northeast Division · Generated {new Date().toLocaleDateString()}
        </p>
      </div>

      {!regionId && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Select a region above to begin. Your answers autosave locally; sign in to also sync to the cloud.
        </div>
      )}

      {regionId && (
        <div className="space-y-3">
          {SCHEMA.map((section) => (
            <details
              key={section.id}
              className="group rounded-lg border border-gray-200 bg-white shadow-sm open:shadow-md"
              open={section.number === 1}
            >
              <summary className="accordion-summary flex cursor-pointer items-start justify-between gap-3 rounded-t-lg p-4 hover:bg-gray-50 group-open:border-b group-open:border-gray-200">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-wide text-arc-blue">
                    Section {section.number}
                  </div>
                  <div className="text-lg font-semibold text-arc-ink">{section.title}</div>
                  {section.objective && (
                    <div className="mt-0.5 text-sm text-gray-600">{section.objective}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {section.help && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        openHelp(section.title, section.help!);
                      }}
                      className="no-print rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
                    >
                      Help
                    </button>
                  )}
                  <svg
                    className="h-5 w-5 shrink-0 text-gray-400 transition group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="space-y-6 p-4">
                {section.intro && (
                  <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                    {section.intro}
                  </p>
                )}
                {section.subsections.map((sub) => (
                  <div key={sub.title} className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                        {sub.title}
                      </h3>
                      {sub.description && (
                        <p className="mt-1 text-sm text-gray-600">{sub.description}</p>
                      )}
                    </div>
                    {sub.fields.map((field) => (
                      <FieldRenderer
                        key={field.id}
                        field={field}
                        values={values}
                        onChange={onChange}
                        onHelp={openHelp}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}

      <HelpModal
        open={help.open}
        title={help.title}
        body={help.body}
        onClose={() => setHelp({ ...help, open: false })}
      />
    </div>
  );
}
