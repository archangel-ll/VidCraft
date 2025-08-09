"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/storage";
import { PRICING_TIERS } from "@/lib/credits";
import { generateReferralCode, normalizeReferralCode } from "@/lib/referrals";
import type { AppStateSnapshot, ReferralEvent, Transaction, User, VslJob, VslParameters } from "@/lib/types";
import { nanoid } from "nanoid";

const STORAGE_KEY = "consulting-hermes-state-v1";

const initialSnapshot: AppStateSnapshot = {
  users: [],
  vslJobs: [],
  transactions: [],
  referrals: [],
  currentUserId: undefined,
};

interface AppContextValue {
  snapshot: AppStateSnapshot;
  currentUser?: User;
  credits: number;
  signup: (email: string, password: string, referralCodeFromUrl?: string) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  generateVsl: (params: VslParameters) => Promise<{ ok: boolean; error?: string }>;
  purchaseTier: (tierId: string) => { ok: boolean; error?: string };
  getReferralLink: () => string | undefined;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function hashPasswordSimple(password: string): string {
  // Non-cryptographic hash for demo purposes only
  let hash = 0;
  for (let i = 0; i < password.length; i++) hash = (hash << 5) - hash + password.charCodeAt(i);
  return Math.abs(hash).toString(36);
}

function save(snapshot: AppStateSnapshot) {
  setLocalStorageItem(STORAGE_KEY, snapshot);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState<AppStateSnapshot>(initialSnapshot);
  const runningJobsRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const fromStorage = getLocalStorageItem<AppStateSnapshot>(STORAGE_KEY, initialSnapshot);
    setSnapshot(fromStorage);
  }, []);

  useEffect(() => {
    // Persist changes
    save(snapshot);
  }, [snapshot]);

  const currentUser = useMemo(
    () => snapshot.users.find((u) => u.id === snapshot.currentUserId),
    [snapshot.users, snapshot.currentUserId]
  );

  const credits = currentUser?.credits ?? 0;

  function signup(email: string, password: string, referralCodeFromUrl?: string) {
    email = email.trim().toLowerCase();
    if (!email || !password) return { ok: false, error: "Email and password are required." };
    if (snapshot.users.some((u) => u.email === email)) return { ok: false, error: "Email already registered." };

    const userId = nanoid();
    const referralCode = generateReferralCode();
    const now = new Date().toISOString();

    const referredByCode = normalizeReferralCode(referralCodeFromUrl);

    const newUser: User = {
      id: userId,
      email,
      passwordHash: hashPasswordSimple(password),
      role: "user",
      credits: 3, // initial grant
      referralCode,
      referredByCode,
      createdAt: now,
    };

    const updatedUsers = [...snapshot.users, newUser];
    const newTransactions: Transaction[] = [
      ...snapshot.transactions,
      {
        id: nanoid(),
        userId,
        createdAt: now,
        type: "credit",
        creditsChange: +3,
        description: "Signup bonus",
      },
    ];

    const updatedReferrals: ReferralEvent[] = [...snapshot.referrals];

    if (referredByCode) {
      const referrer = updatedUsers.find((u) => u.referralCode === referredByCode);
      if (referrer) {
        referrer.credits += 3;
        newUser.credits += 3;
        newTransactions.push(
          {
            id: nanoid(),
            userId: referrer.id,
            createdAt: now,
            type: "credit",
            creditsChange: +3,
            description: `Referral bonus for ${email}`,
          },
          {
            id: nanoid(),
            userId,
            createdAt: now,
            type: "credit",
            creditsChange: +3,
            description: `Referred by ${referrer.email}`,
          }
        );
        updatedReferrals.push({
          id: nanoid(),
          referrerUserId: referrer.id,
          refereeUserId: userId,
          refereeEmail: email,
          createdAt: now,
          creditsAwardedEach: 3,
        });
      }
    }

    setSnapshot({
      ...snapshot,
      users: updatedUsers,
      transactions: newTransactions,
      referrals: updatedReferrals,
      currentUserId: userId,
    });

    return { ok: true };
  }

  function login(email: string, password: string) {
    email = email.trim().toLowerCase();
    const user = snapshot.users.find((u) => u.email === email);
    if (!user) return { ok: false, error: "Invalid credentials." };
    if (user.passwordHash !== hashPasswordSimple(password)) return { ok: false, error: "Invalid credentials." };
    setSnapshot({ ...snapshot, currentUserId: user.id });
    return { ok: true };
  }

  function logout() {
    setSnapshot({ ...snapshot, currentUserId: undefined });
  }

  async function generateVsl(params: VslParameters) {
    const user = currentUser;
    if (!user) return { ok: false, error: "Not authenticated" };
    if (user.credits < 1) return { ok: false, error: "Insufficient credits" };

    // Deduct credit and create job
    const now = new Date().toISOString();
    const jobId = nanoid();

    const job: VslJob = {
      id: jobId,
      userId: user.id,
      createdAt: now,
      updatedAt: now,
      status: "queued",
      progressPercent: 0,
      parameters: params,
      creditCost: 1,
    };

    const updatedUsers = snapshot.users.map((u) =>
      u.id === user.id ? { ...u, credits: u.credits - 1 } : u
    );

    const updatedTransactions: Transaction[] = [
      ...snapshot.transactions,
      {
        id: nanoid(),
        userId: user.id,
        createdAt: now,
        type: "debit",
        creditsChange: -1,
        description: `VSL generation for ${params.productName}`,
      },
    ];

    setSnapshot({
      ...snapshot,
      users: updatedUsers,
      vslJobs: [...snapshot.vslJobs, job],
      transactions: updatedTransactions,
    });

    // Simulate progress over ~6 seconds
    if (runningJobsRef.current[jobId]) return { ok: true };
    runningJobsRef.current[jobId] = true;

    const start = Date.now();
    const totalMs = 6000;

    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
        setSnapshot((prev) => ({
          ...prev,
          vslJobs: prev.vslJobs.map((j) =>
            j.id === jobId
              ? {
                  ...j,
                  status: pct < 100 ? "processing" : "completed",
                  progressPercent: pct,
                  updatedAt: new Date().toISOString(),
                  downloadUrl: pct >= 100 ? makeFakeMp4Url(params) : j.downloadUrl,
                }
              : j
          ),
        }));
        if (pct >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 300);
    });

    return { ok: true };
  }

  function makeFakeMp4Url(params: VslParameters): string {
    // Create a tiny placeholder file for download with .mp4 extension
    const content = `Consulting Hermes VSL\nProduct: ${params.productName}\nAudience: ${params.targetAudience}\nBenefit: ${params.primaryBenefit}\nCTA: ${params.callToAction}\n`;
    const blob = new Blob([content], { type: "video/mp4" });
    return URL.createObjectURL(blob);
  }

  function purchaseTier(tierId: string) {
    const tier = PRICING_TIERS.find((t) => t.id === tierId);
    if (!tier) return { ok: false, error: "Invalid tier" };
    const user = currentUser;
    if (!user) return { ok: false, error: "Not authenticated" };

    const now = new Date().toISOString();
    const updatedUsers = snapshot.users.map((u) =>
      u.id === user.id ? { ...u, credits: u.credits + tier.credits } : u
    );
    const updatedTransactions: Transaction[] = [
      ...snapshot.transactions,
      {
        id: nanoid(),
        userId: user.id,
        createdAt: now,
        type: "purchase",
        creditsChange: tier.credits,
        amountUsd: tier.priceUsd,
        description: `${tier.name} bundle`,
      },
    ];

    setSnapshot({ ...snapshot, users: updatedUsers, transactions: updatedTransactions });
    return { ok: true };
  }

  function getReferralLink() {
    if (!currentUser) return undefined;
    if (typeof window === "undefined") return undefined;
    const url = new URL(window.location.href);
    url.pathname = "/signup";
    url.searchParams.set("ref", currentUser.referralCode);
    return url.toString();
  }

  const value: AppContextValue = {
    snapshot,
    currentUser,
    credits,
    signup,
    login,
    logout,
    generateVsl,
    purchaseTier,
    getReferralLink,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}