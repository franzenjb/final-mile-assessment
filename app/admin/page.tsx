"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { NORTHEAST_REGIONS } from "@/lib/regions";
import { SCHEMA, type FormValues } from "@/lib/schema";

type Plan = {
  id: string;
  region_id: string;
  region_name: string;
  values: FormValues;
  status: string;
  submitted_at: string | null;
  updated_at: string;
  last_edited_by_email: string | null;
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
      const { data: adminFlag } = await supabase.rpc("is_admin");
      const admin = Boolean(adminFlag);
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

  if (!supabase) return <Shell><Card><div>Supabase not configured.</div></Card></Shell>;
  if (!user)
    return (
      <Shell>
        <Card>
          <p className="text-sm">
            Please sign in on the <Link href="/" className="text-accent underline">main page</Link> first, then return here.
          </p>
        </Card>
      </Shell>
    );
  if (isAdmin === false)
    return (
      <Shell>
        <Card>
          <h2 className="text-lg font-semibold text-ink">Not a division admin</h2>
          <p className="mt-2 text-sm text-muted">
            You're signed in as <strong>{user.email}</strong>, but you're not registered as a division admin.
            Ask the system owner to add you to the <code className="rounded bg-bg px-1">admin_emails</code> table.
          </p>
        </Card>
      </Shell>
    );

  const byRegion = NORTHEAST_REGIONS.map((r) => ({
    region: r,
    plan: plans.find((p) => p.region_id === r.id) ?? null,
  }));

  const submittedCount = plans.filter((p) => p.status === "submitted").length;

  return (
    <Shell>
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        <Stat label="Regions" value={`${NORTHEAST_REGIONS.length}`} />
        <Stat label="Plans started" value={`${plans.length} of ${NORTHEAST_REGIONS.length}`} />
        <Stat label="Submitted" value={`${submittedCount} of ${NORTHEAST_REGIONS.length}`} />
      </div>

      {loading && <Card><div>Loading…</div></Card>}

      <div className="space-y-3">
        {byRegion.map(({ region, plan }) => (
          <Card key={region.id}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[17px] font-semibold text-ink">{region.name}</h2>
                {plan ? (
                  <p className="text-2xs text-muted">
                    Last edit by{" "}
                    <span className="font-medium text-ink-soft">{plan.last_edited_by_email ?? "—"}</span>
                    {" · "}
                    {new Date(plan.updated_at).toLocaleString()}
                    {" · status "}
                    <span className="font-medium">{plan.status}</span>
                  </p>
                ) : (
                  <p className="text-2xs text-muted">No plan started yet.</p>
                )}
              </div>
              {plan && (
                <button
                  onClick={() => setOpenId(openId === plan.id ? null : plan.id)}
                  className="rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-bg"
                >
                  {openId === plan.id ? "Collapse" : "Expand"}
                </button>
              )}
            </div>
            {plan && openId === plan.id && (
              <div className="mt-4 space-y-2">
                {SCHEMA.map((s) => {
                  const rows = s.subsections.flatMap((sub) =>
                    sub.fields.flatMap((f) => {
                      if (f.type === "triple") {
                        const parts = [1, 2, 3]
                          .map((n) => plan.values?.[`${f.id}_${n}`])
                          .filter(Boolean);
                        if (!parts.length) return [];
                        return [{ label: f.label, value: parts.join(" · ") }];
                      }
                      const v = plan.values?.[f.id];
                      if (v === "" || v === undefined || (Array.isArray(v) && v.length === 0))
                        return [];
                      return [{ label: f.label, value: Array.isArray(v) ? v.join(", ") : String(v) }];
                    })
                  );
                  if (!rows.length) return null;
                  return (
                    <details key={s.id} className="rounded-lg border border-line bg-bg open:bg-surface">
                      <summary className="cursor-pointer px-3 py-2 text-sm font-semibold text-ink">
                        {s.number}. {s.title}{" "}
                        <span className="font-normal text-muted">({rows.length} answered)</span>
                      </summary>
                      <div className="space-y-2 px-3 pb-3 pt-1">
                        {rows.map((r) => (
                          <div key={r.label} className="border-b border-line pb-1.5 last:border-0">
                            <div className="text-2xs uppercase tracking-wider text-muted">{r.label}</div>
                            <div className="whitespace-pre-wrap text-sm text-ink-soft">{r.value}</div>
                          </div>
                        ))}
                      </div>
                    </details>
                  );
                })}
              </div>
            )}
          </Card>
        ))}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="app-hero relative overflow-hidden border-b border-ink/30 bg-ink text-white">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-arc-red via-arc-red to-arc-red/60" />
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5">
          <div>
            <div className="text-2xs font-semibold uppercase tracking-[0.18em] text-white/60">
              Northeast Division · Admin
            </div>
            <h1 className="mt-1 text-[24px] font-bold tracking-tight">Final Mile Plans</h1>
          </div>
          <Link
            href="/"
            className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/15"
          >
            ← Back to form
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-6">{children}</main>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">{children}</div>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-card">
      <div className="text-2xs font-semibold uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-1 text-2xl font-bold text-ink">{value}</div>
    </div>
  );
}
