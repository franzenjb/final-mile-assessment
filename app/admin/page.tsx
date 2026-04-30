"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { NORTHEAST_REGIONS } from "@/lib/regions";
import { SCHEMA, type FormValues } from "@/lib/schema";

type Plan = {
  id: string;
  user_id: string;
  region_id: string;
  region_name: string;
  values: FormValues;
  status: string;
  submitted_at: string | null;
  updated_at: string;
};

export default function AdminPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !user) return;
    setLoading(true);
    (async () => {
      const { data: adminRow } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();
      const admin = Boolean(adminRow);
      setIsAdmin(admin);
      if (admin) {
        const { data } = await supabase
          .from("regional_plans")
          .select("*")
          .order("region_name", { ascending: true });
        setPlans((data as Plan[]) ?? []);
      }
      setLoading(false);
    })();
  }, [supabase, user]);

  if (!supabase) {
    return <div className="p-6">Supabase not configured.</div>;
  }
  if (!user) {
    return (
      <div className="p-6">
        <p className="mb-3">Sign in on the <Link href="/" className="text-arc-blue underline">main page</Link> first, then return here.</p>
      </div>
    );
  }
  if (isAdmin === false) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Division Admin</h1>
        <p className="mt-2 text-sm text-gray-700">
          You're signed in as <strong>{user.email}</strong>, but you're not registered as a division admin.
          Ask the system owner to add your user_id to the <code>admins</code> table.
        </p>
        <p className="mt-2 text-xs text-gray-500">Your user id: <code>{user.id}</code></p>
      </div>
    );
  }

  const byRegion = NORTHEAST_REGIONS.map((r) => {
    const submitted = plans.filter((p) => p.region_id === r.id);
    return { region: r, plans: submitted };
  });

  return (
    <div className="mx-auto max-w-5xl p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-arc-ink">Division Admin — Final Mile Plans</h1>
          <p className="text-sm text-gray-600">
            Northeast Division · {plans.length} plan{plans.length === 1 ? "" : "s"} on file
          </p>
        </div>
        <Link href="/" className="text-sm text-arc-blue underline">← Back to form</Link>
      </header>

      {loading && <div>Loading…</div>}

      <div className="space-y-3">
        {byRegion.map(({ region, plans: regionPlans }) => (
          <section key={region.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-arc-ink">{region.name}</h2>
              <span className="text-xs text-gray-500">
                {regionPlans.length} plan{regionPlans.length === 1 ? "" : "s"}
              </span>
            </div>
            {regionPlans.length === 0 ? (
              <p className="mt-2 text-sm text-gray-500">No submission yet.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {regionPlans.map((p) => (
                  <li key={p.id} className="rounded border border-gray-100 bg-gray-50 p-3">
                    <button
                      onClick={() => setOpenId(openId === p.id ? null : p.id)}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <span className="text-sm">
                        <span className="font-medium">{p.values?.prepared_by || "Unnamed preparer"}</span>
                        <span className="ml-2 rounded bg-white px-2 py-0.5 text-xs text-gray-700">
                          {p.status}
                        </span>
                      </span>
                      <span className="text-xs text-gray-500">
                        Updated {new Date(p.updated_at).toLocaleString()}
                      </span>
                    </button>
                    {openId === p.id && (
                      <div className="mt-3 space-y-3">
                        {SCHEMA.map((s) => (
                          <details key={s.id} className="rounded border border-gray-200 bg-white p-2">
                            <summary className="cursor-pointer text-sm font-medium">
                              {s.number}. {s.title}
                            </summary>
                            <div className="mt-2 space-y-2 text-sm">
                              {s.subsections.flatMap((sub) =>
                                sub.fields.map((f) => {
                                  const val = (() => {
                                    if (f.type === "triple")
                                      return [1, 2, 3]
                                        .map((n) => p.values?.[`${f.id}_${n}`])
                                        .filter(Boolean)
                                        .join(" · ");
                                    const v = p.values?.[f.id];
                                    if (Array.isArray(v)) return v.join(", ");
                                    return v ?? "";
                                  })();
                                  if (!val) return null;
                                  return (
                                    <div key={f.id} className="border-b border-gray-100 pb-1">
                                      <div className="text-xs uppercase text-gray-500">{f.label}</div>
                                      <div className="whitespace-pre-wrap text-sm">{String(val)}</div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </details>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
