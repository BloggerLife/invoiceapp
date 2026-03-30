"use client";
import React, { useEffect, useState } from "react";

import { PricingPanel } from "@/components/checkout/PricingPanel";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import {
  pricingOptions,
  PricingTier,
  useSubscription,
} from "@/stores/subscription-store";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { selectedPlan, setSelectedPlan } = useSubscription();
  const defaultPlan = selectedPlan ?? "monthly";
  const [selectedTier, setSelectedTier] = useState<PricingTier>(defaultPlan);

  const handleChangePlan = () => {
    const next = selectedTier === "monthly" ? "yearly" : "monthly";
    setSelectedTier(next);
    setSelectedPlan(next);
  };

  const currentPlan = pricingOptions[selectedTier];
  const totalUGX = currentPlan.priceUGX;

  const router = useRouter();
  useEffect(() => {
    if (!selectedPlan) {
      router.push("/pricing");
    }
  }, [selectedPlan, router]);

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-2/5">
          <PricingPanel
            selectedTier={selectedTier}
            pricingOption={currentPlan}
            onChangePlan={handleChangePlan}
          />
        </div>
        <div className="w-full md:w-3/5">
          <PaymentForm
            subtotal={totalUGX}
            discount={0}
            total={totalUGX}
            selectedTier={selectedTier}
          />
        </div>
      </div>
    </div>
  );
}
