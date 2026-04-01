"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  AlertTriangle,
  Check,
  Crown,
  Zap,
  Star,
} from "lucide-react";
import { useSubscription, pricingOptions } from "@/stores/subscription-store";
import { cancelSubscription } from "@/actions/billing-actions";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCEEDED" | "FAILED" | "CANCELLED" | "REFUNDED";
  description: string | null;
  plan: "FREE" | "MONTHLY" | "YEARLY";
  interval: string | null;
  paidAt?: string;
  failedAt?: string;
  refundedAt?: string;
  receiptUrl?: string | null;
  invoiceUrl?: string | null;
  createdAt: string;
}

interface Subscription {
  id: string;
  plan: "FREE" | "MONTHLY" | "YEARLY";
  status: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  cancelAt?: string;
  priceAmount?: number;
  priceCurrency: string;
  interval?: string;
}

interface BillingClientProps {
  initialSubscription: Subscription | null;
  initialPayments: Payment[];
  invoiceCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  userEmail: string;
}

const planMeta = {
  free: { icon: Zap, color: "border-gray-200", bg: "bg-gray-50" },
  monthly: { icon: Star, color: "border-blue-200", bg: "bg-blue-50" },
  yearly: { icon: Crown, color: "border-indigo-200", bg: "bg-indigo-50" },
};

const BillingClient: React.FC<BillingClientProps> = ({
  initialSubscription,
  initialPayments,
  pagination,
  userEmail,
  invoiceCount,
}) => {
  const router = useRouter();
  const { setSelectedPlan } = useSubscription();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentPlan = initialSubscription?.plan || "FREE";
  const currentPlanKey =
    currentPlan === "MONTHLY"
      ? "monthly"
      : currentPlan === "YEARLY"
        ? "yearly"
        : "free";

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatAmount = (amount: number, currency: string) => {
    if (currency.toUpperCase() === "USD")
      return `USD ${amount.toLocaleString()}`;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const handleSelectPlan = (planKey: "free" | "monthly" | "yearly") => {
    if (planKey === "free") return;
    if (planKey === currentPlanKey) return;
    setSelectedPlan(planKey);
    router.push("/checkout");
  };

  const handleCancelSubscription = () => {
    startTransition(async () => {
      try {
        const result = await cancelSubscription(false);
        if (result.success) {
          setShowCancelConfirm(false);
          router.refresh();
        } else {
          setError(result.message);
        }
      } catch {
        setError("Failed to cancel subscription");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-700 hover:text-red-900"
            >
              x
            </button>
          </div>
        )}

        {/* Plan Cards */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["free", "monthly", "yearly"] as const).map((key) => {
              const plan = pricingOptions[key];
              const meta = planMeta[key];
              const isCurrent = key === currentPlanKey;
              const Icon = meta.icon;

              return (
                <div
                  key={key}
                  className={`relative rounded-xl border-2 p-5 transition-all ${
                    isCurrent
                      ? `${meta.color} ${meta.bg} ring-2 ring-blue-500`
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}

                  {isCurrent && (
                    <span className="absolute -top-3 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Current
                    </span>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`w-9 h-9 rounded-lg ${meta.bg} flex items-center justify-center`}
                    >
                      <Icon className="h-5 w-5 text-gray-700" />
                    </div>
                    <h3 className="font-bold text-gray-900">{plan.name}</h3>
                  </div>

                  <div className="mb-3">
                    {plan.priceUGX > 0 ? (
                      <div>
                        <span className="text-2xl font-bold text-gray-900">
                          USD {plan.priceUGX.toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm">/month</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-2xl font-bold text-gray-900">
                          Free
                        </span>
                        <span className="text-gray-500 text-sm"> forever</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mb-4">
                    {plan.description}
                  </p>

                  <div className="mb-4 text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg inline-block">
                    {plan.dailyInvoices === "Unlimited"
                      ? "Unlimited invoices/day"
                      : `${plan.dailyInvoices} invoices/day`}
                  </div>

                  <ul className="space-y-2 mb-5">
                    {plan.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {key === "free" ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
                    >
                      {isCurrent ? "Current Plan" : "Default"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectPlan(key)}
                      disabled={isCurrent || isPending}
                      className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isCurrent
                          ? "bg-blue-100 text-blue-700 cursor-default"
                          : plan.popular
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isCurrent ? "Current Plan" : `Upgrade to ${plan.name}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Subscription Info */}
        {initialSubscription &&
          initialSubscription.plan !== "FREE" &&
          initialSubscription.currentPeriodEnd && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Your{" "}
                    <span className="font-semibold text-gray-900">
                      {currentPlan === "MONTHLY" ? "Starter" : "Pro"}
                    </span>{" "}
                    plan renews on{" "}
                    <span className="font-medium">
                      {formatDate(initialSubscription.currentPeriodEnd)}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={isPending}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Cancel plan
                </button>
              </div>
            </div>
          )}

        {/* Payment History */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Payment History
          </h2>

          {initialPayments.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 font-medium text-gray-500">
                        Date
                      </th>
                      <th className="text-left py-3 font-medium text-gray-500">
                        Plan
                      </th>
                      <th className="text-left py-3 font-medium text-gray-500">
                        Amount
                      </th>
                      <th className="text-left py-3 font-medium text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {initialPayments.map((p) => (
                      <tr key={p.id}>
                        <td className="py-3 text-gray-700">
                          {p.paidAt
                            ? formatDate(p.paidAt)
                            : formatDate(p.createdAt)}
                        </td>
                        <td className="py-3 text-gray-700">
                          {p.plan === "MONTHLY"
                            ? "Starter"
                            : p.plan === "YEARLY"
                              ? "Pro"
                              : "Free"}
                        </td>
                        <td className="py-3 font-medium text-gray-900">
                          {formatAmount(p.amount, p.currency)}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === "SUCCEEDED" ? "bg-green-100 text-green-700" : p.status === "FAILED" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
                          >
                            {p.status === "SUCCEEDED" ? "Paid" : p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {initialPayments.map((p) => (
                  <div
                    key={p.id}
                    className="border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {p.plan === "MONTHLY"
                          ? "Starter"
                          : p.plan === "YEARLY"
                            ? "Pro"
                            : "Free"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {p.paidAt
                          ? formatDate(p.paidAt)
                          : formatDate(p.createdAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatAmount(p.amount, p.currency)}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === "SUCCEEDED" ? "bg-green-100 text-green-700" : p.status === "FAILED" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {p.status === "SUCCEEDED" ? "Paid" : p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-400 py-6">No payments yet</p>
          )}
        </div>

        {/* Cancel Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-2">Cancel Plan</h3>
              <p className="text-gray-600 text-sm mb-6">
                You'll keep access until the end of your billing period.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={isPending}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Keep Plan
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={isPending}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  {isPending ? "Cancelling..." : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingClient;
