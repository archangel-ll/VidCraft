"use client";

import { Modal } from "./ui/modal";
import { Button } from "./ui/button";
import type { PricingTier } from "@/lib/types";
import { formatUsd } from "@/lib/credits";

export function CheckoutModal({ open, onClose, tier, onConfirm }: { open: boolean; onClose: () => void; tier?: PricingTier; onConfirm: (tierId: string) => void }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-5">
        <h3 className="text-lg font-semibold">Checkout</h3>
        {tier ? (
          <p className="mt-2 text-sm text-slate-600">Confirm purchase of {tier.credits} credits ({tier.name}) for {formatUsd(tier.priceUsd)}.</p>
        ) : null}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          {tier ? (
            <Button onClick={() => onConfirm(tier.id)}>Pay {formatUsd(tier.priceUsd)}</Button>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}