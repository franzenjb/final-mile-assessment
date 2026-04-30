"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function AuthBar() {
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
      <div className="no-print rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        Cloud save disabled — Supabase env vars not set. Answers still autosave to this browser.
      </div>
    );
  }

  if (!user) {
    return (
      <div className="no-print rounded-md border border-gray-200 bg-white p-3">
        {sent ? (
          <div className="text-sm text-green-700">
            Check your email for the sign-in link, then return to this page.
          </div>
        ) : (
          <form
            className="flex flex-wrap items-center gap-2"
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
            <span className="text-sm font-medium text-arc-ink">Sign in to save to cloud:</span>
            <input
              type="email"
              required
              placeholder="you@redcross.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-arc-blue focus:outline-none focus:ring-1 focus:ring-arc-blue"
            />
            <button
              type="submit"
              disabled={sending}
              className="rounded-md bg-arc-blue px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {sending ? "Sending…" : "Send magic link"}
            </button>
            {err && <span className="text-xs text-red-600">{err}</span>}
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="no-print flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
      <span className="text-gray-700">
        Signed in as <strong>{user.email}</strong> — your answers sync to the cloud.
      </span>
      <button
        onClick={() => supabase.auth.signOut()}
        className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
      >
        Sign out
      </button>
    </div>
  );
}
