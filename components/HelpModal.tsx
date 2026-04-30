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
  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-arc-ink">{title}</h3>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100"
            aria-label="Close help"
          >
            ✕
          </button>
        </div>
        <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{body}</p>
        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="rounded-md bg-arc-blue px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
