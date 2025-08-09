"use client";

import { useState } from "react";
import { PRICING_TIERS, formatUsd } from "@/lib/credits";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CheckoutModal } from "@/components/CheckoutModal";
import { useApp } from "@/context/AppContext";

export default function PricingPage() {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const { purchaseTier } = useApp();

  const selectedTier = PRICING_TIERS.find((t) => t.id === selectedId);

  function onBuy(id: string) {
    setSelectedId(id);
    setOpen(true);
  }

  function onConfirm(tierId: string) {
    purchaseTier(tierId);
    setOpen(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-center">Simple, transparent pricing</h1>
      <p className="mt-2 text-center text-slate-600">Buy credits as you need them. Each VSL costs 1 credit.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {PRICING_TIERS.map((tier) => (
          <Card key={tier.id} className="flex flex-col">
            <CardHeader>
              <h3 className="text-xl font-semibold">{tier.name}</h3>
              <p className="text-sm text-slate-600">{tier.credits} credits</p>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-3xl font-bold">{formatUsd(tier.priceUsd)}</div>
              {tier.savingsPercent ? (
                <div className="mt-1 text-sm text-amber-600 font-medium">Save {tier.savingsPercent}%</div>
              ) : null}
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>Commercial license</li>
                <li>Web-ready MP4</li>
                <li>Auto captions</li>
                <li>Branded colors</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => onBuy(tier.id)}>Buy {tier.credits} credits</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <CheckoutModal open={open} onClose={() => setOpen(false)} tier={selectedTier} onConfirm={onConfirm} />
    </div>
  );
}