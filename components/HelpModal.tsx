"use client";
import { useEffect } from "react";

export default function HelpModal({
  open,
  title,
  body,
  onClose,
}: {
  open: boolean;
  title: string;
  body: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  // Convert plain-text help (with double newlines and ALL-CAPS section headers) into nicer markup.
  const blocks = body.split(/\n\n+/);

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
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
              ?
            </div>
            <h3 className="text-lg font-semibold leading-tight text-ink">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted hover:bg-line/60 hover:text-ink"
            aria-label="Close help"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>
        <div className="max-h-[65vh] space-y-4 overflow-y-auto px-6 py-5 text-[15px] leading-relaxed text-ink-soft">
          {blocks.map((block, i) => {
            // Detect section headers (ALL CAPS lines)
            const lines = block.split("\n");
            const first = lines[0];
            const isHeader = first === first.toUpperCase() && /[A-Z]/.test(first) && first.length < 80;
            if (isHeader && lines.length > 1) {
              return (
                <div key={i}>
                  <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
                    {first}
                  </div>
                  <p className="whitespace-pre-line">{lines.slice(1).join("\n")}</p>
                </div>
              );
            }
            return (
              <p key={i} className="whitespace-pre-line">
                {block}
              </p>
            );
          })}
        </div>
        <div className="flex justify-end border-t border-line bg-bg px-6 py-3">
          <button
            onClick={onClose}
            className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
