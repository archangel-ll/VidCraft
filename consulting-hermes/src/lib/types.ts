export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  credits: number;
  referralCode: string;
  referredByCode?: string;
  createdAt: string;
}

export type VslJobStatus = "queued" | "processing" | "completed" | "failed";

export interface VslParameters {
  productName: string;
  targetAudience: string;
  tone: "friendly" | "professional" | "excited" | "urgent" | "casual" | "authoritative";
  brandColorHex: string;
  primaryBenefit: string;
  callToAction: string;
}

export interface VslJob {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: VslJobStatus;
  progressPercent: number;
  parameters: VslParameters;
  downloadUrl?: string;
  failureReason?: string;
  creditCost: number;
}

export interface Transaction {
  id: string;
  userId: string;
  createdAt: string;
  type: "purchase" | "debit" | "credit";
  creditsChange: number;
  amountUsd?: number;
  description: string;
}

export interface ReferralEvent {
  id: string;
  referrerUserId: string;
  refereeUserId: string;
  refereeEmail: string;
  createdAt: string;
  creditsAwardedEach: number;
}

export interface PricingTier {
  id: string;
  name: string;
  credits: number;
  priceUsd: number;
  savingsPercent?: number;
}

export interface AppStateSnapshot {
  users: User[];
  vslJobs: VslJob[];
  transactions: Transaction[];
  referrals: ReferralEvent[];
  currentUserId?: string;
}