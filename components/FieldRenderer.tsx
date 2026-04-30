"use client";
import type { Field, FormValues } from "@/lib/schema";

type Props = {
  field: Field;
  values: FormValues;
  onChange: (id: string, value: string | string[] | number) => void;
  onHelp: (title: string, body: string) => void;
};

const inputBase =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-arc-blue focus:outline-none focus:ring-1 focus:ring-arc-blue";

export default function FieldRenderer({ field, values, onChange, onHelp }: Props) {
  const v = values[field.id];

  const helpBtn = field.help ? (
    <button
      type="button"
      className="no-print ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-xs text-gray-500 hover:bg-gray-100"
      onClick={() => onHelp(field.label, field.help!)}
      aria-label={`Help for ${field.label}`}
    >
      ?
    </button>
  ) : null;

  const labelEl = (
    <label className="mb-1 block text-sm font-medium text-arc-ink">
      {field.label}
      {helpBtn}
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
          <div className="flex items-center">
            <span className="mr-2 text-gray-500">$</span>
            <input
              type="number"
              step="0.01"
              className={inputBase}
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
    case "yesno":
      return (
        <div>
          {labelEl}
          <select
            className={inputBase}
            value={(v as string) ?? ""}
            onChange={(e) => onChange(field.id, e.target.value)}
          >
            <option value="">Select…</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Partial">Partial</option>
            <option value="N/A">N/A</option>
          </select>
        </div>
      );
    case "checklist": {
      const checked = (v as string[]) ?? [];
      return (
        <div>
          {labelEl}
          <div className="space-y-2">
            {field.options?.map((o) => {
              const isOn = checked.includes(o);
              return (
                <label key={o} className="flex cursor-pointer items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isOn}
                    onChange={() => {
                      const next = isOn ? checked.filter((x) => x !== o) : [...checked, o];
                      onChange(field.id, next);
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-arc-blue focus:ring-arc-blue"
                  />
                  <span>{o}</span>
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
