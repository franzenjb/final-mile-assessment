"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function AuthBar({ compact = false }: { compact?: boolean }) {
  const supabase = getSupabaseBrowser();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  if (!supabase) {
    return (
      <div className="no-print rounded-lg border border-arc-amber/30 bg-arc-amber-soft px-3 py-2 text-xs text-arc-amber">
        Cloud save disabled — Supabase not configured.
      </div>
    );
  }

  if (!user) {
    if (sent) {
      return (
        <div className="no-print rounded-lg border border-arc-green/20 bg-arc-green-soft px-3 py-2 text-sm text-arc-green">
          ✓ Sign-in link sent. Check your email.
        </div>
      );
    }
    return (
      <form
        className="no-print flex flex-wrap items-center gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!email) return;
          setSending(true);
          setErr(null);
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: window.location.origin + "/auth/callback" },
          });
          setSending(false);
          if (error) setErr(error.message);
          else setSent(true);
        }}
      >
        {!compact && <span className="text-sm font-medium text-ink-soft">Sign in:</span>}
        <input
          type="email"
          required
          placeholder="you@redcross.org"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-[220px] flex-1 rounded-md border border-line bg-surface px-3 py-1.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send magic link"}
        </button>
        {err && <span className="text-xs text-arc-red">{err}</span>}
      </form>
    );
  }

  return (
    <div className="no-print flex items-center gap-2 text-sm">
      <span className="hidden sm:inline text-muted">Signed in as</span>
      <span className="font-medium text-ink">{user.email}</span>
      <button
        onClick={() => supabase.auth.signOut()}
        className="rounded-md border border-line px-2 py-1 text-2xs uppercase tracking-wider text-muted hover:bg-bg hover:text-ink"
      >
        Sign out
      </button>
    </div>
  );
}
