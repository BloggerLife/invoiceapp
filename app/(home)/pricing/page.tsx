"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  FileText,
  Download,
  Clock,
  DollarSign,
  Crown,
  Star,
  Zap,
} from "lucide-react";
import {
  useSubscription,
  pricingOptions,
  PricingTier,
} from "@/stores/subscription-store";

const PricingPage: React.FC = () => {
  const router = useRouter();
  const { setSelectedPlan } = useSubscription();

  const handlePlanSelection = (planId: PricingTier) => {
    setSelectedPlan(planId);
    if (planId === "free") {
      router.push("/auth");
    } else {
      router.push("/checkout");
    }
  };

  const plans = [
    { key: "free" as const, icon: Zap, badge: null },
    { key: "monthly" as const, icon: Star, badge: null },
    { key: "yearly" as const, icon: Crown, badge: "Most Popular" },
  ];

  const features = [
    { name: "Invoices per day", free: "1", monthly: "5", yearly: "Unlimited" },
    { name: "Invoice & Quotation types", free: true, monthly: true, yearly: true },
    { name: "PDF download & print", free: true, monthly: true, yearly: true },
    { name: "Email sending", free: true, monthly: true, yearly: true },
    { name: "Custom branding", free: true, monthly: true, yearly: true },
    { name: "Client management", free: true, monthly: true, yearly: true },
    { name: "Payment collection", free: false, monthly: true, yearly: true },
    { name: "Multi-currency wallet", free: false, monthly: true, yearly: true },
    { name: "Mobile money withdrawals", free: false, monthly: true, yearly: true },
    { name: "Priority support", free: false, monthly: true, yearly: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Start for free. Upgrade when you need more invoices or payment
            collection features.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {plans.map(({ key, icon: Icon, badge }) => {
            const plan = pricingOptions[key];
            const isPopular = plan.popular;

            return (
              <div
                key={key}
                className={`relative rounded-2xl border-2 p-6 bg-white transition-all hover:shadow-lg ${
                  isPopular
                    ? "border-indigo-500 shadow-md"
                    : "border-slate-200"
                }`}
              >
                {badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    {badge}
                  </span>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isPopular ? "bg-indigo-100" : "bg-slate-100"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isPopular ? "text-indigo-600" : "text-slate-600"
                      }`}
                    />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {plan.name}
                  </h2>
                </div>

                <div className="mb-2">
                  {plan.priceUGX > 0 ? (
                    <div>
                      <span className="text-3xl font-bold text-slate-900">
                        UGX {plan.priceUGX.toLocaleString()}
                      </span>
                      <span className="text-slate-500">/month</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-3xl font-bold text-slate-900">
                        Free
                      </span>
                      <span className="text-slate-500"> forever</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-slate-500 mb-4">{plan.description}</p>

                <div className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-lg inline-block mb-5">
                  {plan.dailyInvoices === "Unlimited"
                    ? "Unlimited invoices/day"
                    : `${plan.dailyInvoices} invoices/day`}
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelection(key)}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                    isPopular
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : key === "free"
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {key === "free" ? "Get Started Free" : `Choose ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Feature Comparison
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-4 text-left font-semibold text-slate-900">
                    Feature
                  </th>
                  <th className="p-4 text-center font-semibold text-slate-900">
                    Free
                  </th>
                  <th className="p-4 text-center font-semibold text-slate-900">
                    Starter
                  </th>
                  <th className="p-4 text-center font-semibold text-slate-900">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((row, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-slate-50/50" : "bg-white"}
                  >
                    <td className="p-4 font-medium text-slate-700">
                      {row.name}
                    </td>
                    {(["free", "monthly", "yearly"] as const).map((tier) => (
                      <td key={tier} className="p-4 text-center">
                        {typeof row[tier] === "boolean" ? (
                          row[tier] ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-slate-300">-</span>
                          )
                        ) : (
                          <span className="font-medium text-slate-700">
                            {row[tier]}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Why Invoice Generator Pro?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Clock,
                title: "Create in 30s",
                description: "Professional invoices & quotations in seconds",
              },
              {
                icon: FileText,
                title: "Beautiful PDFs",
                description: "Multiple templates with your custom branding",
              },
              {
                icon: Download,
                title: "Get Paid Online",
                description: "Clients pay via Mobile Money or Card",
              },
              {
                icon: DollarSign,
                title: "Instant Withdrawals",
                description: "Withdraw earnings to your phone anytime",
              },
            ].map((b, i) => (
              <div
                key={i}
                className="text-center p-5 bg-white rounded-xl border border-slate-200"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <b.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {b.title}
                </h3>
                <p className="text-sm text-slate-500">{b.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Ready to get started?
          </h2>
          <button
            onClick={() => handlePlanSelection("free")}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
          >
            Start for Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
