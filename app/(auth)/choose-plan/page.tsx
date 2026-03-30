"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Check, Crown, Star, Zap } from "lucide-react";
import {
  pricingOptions,
  PricingTier,
  useSubscription,
} from "@/stores/subscription-store";

const plans = [
  { key: "free" as const, icon: Zap },
  { key: "monthly" as const, icon: Star },
  { key: "yearly" as const, icon: Crown },
];

export default function ChoosePlanPage() {
  const router = useRouter();
  const { setSelectedPlan } = useSubscription();

  const handleSelect = (key: PricingTier) => {
    setSelectedPlan(key);
    if (key === "free") {
      router.push("/dashboard");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Choose Your Plan
          </h1>
          <p className="text-slate-500">
            You can always change your plan later from the billing page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(({ key, icon: Icon }) => {
            const plan = pricingOptions[key];
            const isPopular = plan.popular;

            return (
              <div
                key={key}
                className={`relative rounded-2xl border-2 p-5 bg-white transition-all hover:shadow-lg cursor-pointer ${
                  isPopular
                    ? "border-indigo-500 shadow-md"
                    : "border-slate-200 hover:border-slate-300"
                }`}
                onClick={() => handleSelect(key)}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Recommended
                  </span>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isPopular ? "bg-indigo-100" : "bg-slate-100"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isPopular ? "text-indigo-600" : "text-slate-600"
                      }`}
                    />
                  </div>
                  <h3 className="font-bold text-slate-900">{plan.name}</h3>
                </div>

                <div className="mb-2">
                  {plan.priceUGX > 0 ? (
                    <span className="text-2xl font-bold text-slate-900">
                      UGX {plan.priceUGX.toLocaleString()}
                      <span className="text-sm font-normal text-slate-500">
                        /mo
                      </span>
                    </span>
                  ) : (
                    <span className="text-2xl font-bold text-slate-900">
                      Free
                    </span>
                  )}
                </div>

                <div className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-md inline-block mb-3">
                  {plan.dailyInvoices === "Unlimited"
                    ? "Unlimited invoices/day"
                    : `${plan.dailyInvoices} invoices/day`}
                </div>

                <ul className="space-y-1.5 mb-4">
                  {plan.features.slice(0, 5).map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-1.5 text-xs text-slate-600"
                    >
                      <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isPopular
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : key === "free"
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {key === "free"
                    ? "Continue with Free"
                    : `Choose ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          All plans include custom branding, PDF export, and email sending.
        </p>
      </div>
    </div>
  );
}
