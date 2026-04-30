"use client";

import { useEffect, useState } from "react";
import type { FormValues } from "@/lib/schema";

type Snapshot = {
  id: string;
  region_id: string;
  values: FormValues;
  status: string;
  edited_by_email: string | null;
  edited_by_name: string | null;
  snapshotted_at: string;
};

export default function HistoryModal({
  open,
  snapshots,
  onClose,
  onRestore,
  loading,
}: {
  open: boolean;
  snapshots: Snapshot[];
  onClose: () => void;
  onRestore: (snap: Snapshot) => void;
  loading?: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-surface shadow-2xl ring-1 ring-line"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line bg-bg px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-ink">Edit history</h3>
            <p className="text-xs text-muted">
              Every save snapshots a backup. Click any version to view; restore brings it back.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted hover:bg-line/60 hover:text-ink"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto p-4">
          {loading && <div className="p-6 text-center text-sm text-muted">Loading…</div>}
          {!loading && snapshots.length === 0 && (
            <div className="p-6 text-center text-sm text-muted">No history yet.</div>
          )}
          {!loading &&
            snapshots.map((s) => {
              const expanded = openId === s.id;
              const filled = Object.values(s.values || {}).filter((v) => {
                if (Array.isArray(v)) return v.length > 0;
                return v !== "" && v !== undefined && v !== null;
              }).length;
              return (
                <div key={s.id} className="mb-2 rounded-lg border border-line">
                  <button
                    onClick={() => setOpenId(expanded ? null : s.id)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-bg"
                  >
                    <div>
                      <div className="text-sm font-medium text-ink">
                        {new Date(s.snapshotted_at).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted">
                        {s.edited_by_email || "unknown"} · {filled} fields filled · status{" "}
                        <span className="font-medium">{s.status}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Restore this version? Your current draft will be saved to history first.")) {
                          onRestore(s);
                          onClose();
                        }
                      }}
                      className="rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:bg-bg"
                    >
                      Restore
                    </button>
                  </button>
                  {expanded && (
                    <pre className="max-h-64 overflow-auto border-t border-line bg-bg p-3 text-2xs text-ink-soft">
                      {JSON.stringify(s.values, null, 2)}
                    </pre>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
