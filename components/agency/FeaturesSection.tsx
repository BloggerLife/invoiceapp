import React from "react";
import {
  FileText,
  CreditCard,
  Wallet,
  Phone,
  ArrowUpCircle,
  Globe,
  Shield,
  Zap,
  Receipt,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: FileText,
    title: "Invoices & Quotations",
    description:
      "Create professional invoices or quotations in seconds. Choose the document type from a dropdown and the entire PDF, preview, and email adapts automatically.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Globe,
    title: "Payment Links",
    description:
      "Every invoice gets a shareable payment link. Send it via email, WhatsApp, or any channel. Your client pays online without needing an account.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Phone,
    title: "Mobile Money Payments",
    description:
      "Clients pay via MTN or Airtel Mobile Money. They receive a USSD prompt on their phone and confirm the payment. Works across Uganda, Kenya, Tanzania, and Rwanda.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: CreditCard,
    title: "Card Payments",
    description:
      "Accept Visa and Mastercard payments through our secure card payment integration. Clients enter card details on a branded checkout page.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Wallet,
    title: "Multi-Currency Wallet",
    description:
      "All payments land in your wallet with separate balances per currency (UGX, USD, KES, and more). Track every transaction with a clear breakdown of fees.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: ArrowUpCircle,
    title: "Instant Withdrawals",
    description:
      "Withdraw your earnings to any mobile money number instantly. Enter your phone number, the amount, and the money is sent to your phone.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Receipt,
    title: "8% Platform Fee Only",
    description:
      "No monthly fees to collect payments. We only charge 8% when you actually get paid. The fee is transparently shown in your wallet transaction history.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Payments are processed through DGateway, a trusted payment aggregator. Your data and your clients' payment details are always protected.",
    color: "bg-slate-50 text-slate-600",
  },
  {
    icon: Zap,
    title: "Get Paid Faster",
    description:
      "No more chasing payments. Send an invoice with a payment link and your client can pay in under 30 seconds from their phone.",
    color: "bg-amber-50 text-amber-600",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-12 md:py-24 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <span className="inline-flex items-center px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs md:text-sm font-semibold mb-3 md:mb-4">
            Features
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              invoice & get paid
            </span>
          </h2>
          <p className="text-sm md:text-lg text-gray-600 px-2">
            Create invoices, share payment links, collect money via Mobile Money
            or Card, and withdraw to your phone. All in one platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl ${feature.color} flex items-center justify-center mb-3 md:mb-4`}
              >
                <feature.icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">
                {feature.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10 md:mt-16">
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 md:px-8 md:py-4 rounded-xl transition-all shadow-lg hover:shadow-xl text-sm md:text-base"
          >
            Start Invoicing for Free
            <Zap className="h-4 w-4 md:h-5 md:w-5" />
          </Link>
          <p className="text-xs md:text-sm text-gray-400 mt-2 md:mt-3">
            No credit card required. 1 free invoice per day.
          </p>
        </div>
      </div>
    </section>
  );
}
