"use client";
import type { Field, FormValues } from "@/lib/schema";

type Props = {
  field: Field;
  values: FormValues;
  onChange: (id: string, value: string | string[] | number) => void;
  onHelp: (title: string, body: string) => void;
};

const inputBase =
  "w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink shadow-sm placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15 transition";

const HelpButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Help"
    className="no-print ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-line text-[11px] font-semibold text-muted hover:border-accent hover:bg-accent/5 hover:text-accent"
  >
    ?
  </button>
);

export default function FieldRenderer({ field, values, onChange, onHelp }: Props) {
  const v = values[field.id];

  const labelEl = (
    <label className="mb-1.5 flex items-center text-[13.5px] font-semibold text-ink-soft">
      <span>{field.label}</span>
      {field.help && <HelpButton onClick={() => onHelp(field.label, field.help!)} />}
    </label>
  );

  switch (field.type) {
    case "text":
      return (
        <div>
          {labelEl}
          <input
            type="text"
            className={inputBase}
            placeholder={field.placeholder}
            value={(v as string) ?? ""}
            onChange={(e) => onChange(field.id, e.target.value)}
          />
        </div>
      );
    case "number":
      return (
        <div>
          {labelEl}
          <input
            type="number"
            className={inputBase}
            placeholder={field.placeholder}
            value={(v as string) ?? ""}
            onChange={(e) => onChange(field.id, e.target.value)}
          />
        </div>
      );
    case "currency":
      return (
        <div>
          {labelEl}
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
              $
            </span>
            <input
              type="number"
              step="0.01"
              className={`${inputBase} pl-8`}
              placeholder="0.00"
              value={(v as string) ?? ""}
              onChange={(e) => onChange(field.id, e.target.value)}
            />
          </div>
        </div>
      );
    case "date":
      return (
        <div>
          {labelEl}
          <input
            type="date"
            className={inputBase}
            value={(v as string) ?? ""}
            onChange={(e) => onChange(field.id, e.target.value)}
          />
        </div>
      );
    case "textarea":
      return (
        <div>
          {labelEl}
          <textarea
            className={inputBase}
            rows={field.rows ?? 4}
            placeholder={field.placeholder}
            value={(v as string) ?? ""}
            onChange={(e) => onChange(field.id, e.target.value)}
          />
        </div>
      );
    case "select":
      return (
        <div>
          {labelEl}
          <select
            className={inputBase}
            value={(v as string) ?? ""}
            onChange={(e) => onChange(field.id, e.target.value)}
          >
            <option value="">Select…</option>
            {field.options?.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      );
    case "yesno": {
      const opts = ["Yes", "No", "Partial", "N/A"];
      const cur = (v as string) ?? "";
      return (
        <div>
          {labelEl}
          <div className="inline-flex flex-wrap gap-1.5 rounded-lg border border-line bg-surface p-1 shadow-sm">
            {opts.map((o) => {
              const active = cur === o;
              return (
                <button
                  key={o}
                  type="button"
                  onClick={() => onChange(field.id, active ? "" : o)}
                  className={
                    active
                      ? "rounded-md bg-ink px-3 py-1.5 text-[13px] font-medium text-white shadow-sm"
                      : "rounded-md px-3 py-1.5 text-[13px] font-medium text-muted hover:bg-bg hover:text-ink"
                  }
                >
                  {o}
                </button>
              );
            })}
          </div>
        </div>
      );
    }
    case "checklist": {
      const checked = (v as string[]) ?? [];
      return (
        <div>
          {labelEl}
          <div className="grid grid-cols-1 gap-2 rounded-lg border border-line bg-surface p-3 shadow-sm">
            {field.options?.map((o) => {
              const isOn = checked.includes(o);
              return (
                <label
                  key={o}
                  className={`flex cursor-pointer items-start gap-2.5 rounded-md border p-2 text-[14px] ${
                    isOn ? "border-accent bg-accent-soft" : "border-transparent hover:bg-bg"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isOn}
                    onChange={() => {
                      const next = isOn ? checked.filter((x) => x !== o) : [...checked, o];
                      onChange(field.id, next);
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-line-strong text-accent focus:ring-accent"
                  />
                  <span className="text-ink-soft">{o}</span>
                </label>
              );
            })}
          </div>
        </div>
      );
    }
    case "triple":
      return (
        <div>
          {labelEl}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <input
                key={n}
                type="text"
                className={inputBase}
                placeholder={`#${n}`}
                value={(values[`${field.id}_${n}`] as string) ?? ""}
                onChange={(e) => onChange(`${field.id}_${n}`, e.target.value)}
              />
            ))}
          </div>
        </div>
      );
  }
}
