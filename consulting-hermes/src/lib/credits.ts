import type { PricingTier } from "./types";

export const PRICING_TIERS: PricingTier[] = [
  { id: "starter", name: "Starter", credits: 10, priceUsd: 100 },
  { id: "pro", name: "Pro", credits: 25, priceUsd: 225, savingsPercent: 10 },
  { id: "scale", name: "Scale", credits: 60, priceUsd: 480, savingsPercent: 20 },
];

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(amount);
}

export function canAffordGeneration(credits: number, cost = 1): boolean {
  return credits >= cost;
}