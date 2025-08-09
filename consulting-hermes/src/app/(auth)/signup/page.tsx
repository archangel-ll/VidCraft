"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizeReferralCode } from "@/lib/referrals";

function SignupInner() {
  const { signup } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialRefCode = useMemo(() => normalizeReferralCode(searchParams.get("ref")), [searchParams]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    // nothing for now; referral is read from query
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = signup(email, password, initialRefCode);
    if (!res.ok) {
      setError(res.error);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-slate-600">Start with 3 free credits. No card required.</p>
        {initialRefCode ? (
          <p className="mt-2 text-xs text-slate-600">Referral code detected: <span className="font-mono font-semibold">{initialRefCode}</span> (Both of you get +3 credits)</p>
        ) : null}
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" className="w-full">Create account</Button>
        </form>
        <p className="mt-4 text-sm text-slate-600">Already have an account? <a className="text-sky-600 hover:underline" href="/login">Log in</a></p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-10 text-sm text-slate-600">Loading…</div>}>
      <SignupInner />
    </Suspense>
  );
}