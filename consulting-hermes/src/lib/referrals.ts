import { customAlphabet } from "nanoid";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // avoid ambiguous chars
const nano = customAlphabet(alphabet, 8);

export function generateReferralCode(): string {
  return nano();
}

export function normalizeReferralCode(code?: string | null): string | undefined {
  if (!code) return undefined;
  const trimmed = String(code).toUpperCase().replace(/[^A-Z0-9]/g, "");
  return trimmed.length >= 6 && trimmed.length <= 12 ? trimmed : undefined;
}