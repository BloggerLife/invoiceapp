import React from "react";
import {
  FileText,
  Link2,
  Smartphone,
  CreditCard,
  Wallet,
  ArrowUpCircle,
} from "lucide-react";

const bentoItems = [
  {
    icon: FileText,
    title: "Invoices & Quotations",
    description:
      "Create professional documents in seconds. Switch between invoice and quotation with one click.",
    color: "from-blue-500 to-indigo-600",
    iconBg: "bg-blue-100 text-blue-600",
    span: "md:col-span-2",
    image: "/images/bento-invoice.svg",
  },
  {
    icon: Link2,
    title: "Payment Links",
    description:
      "Share a link via WhatsApp, SMS, or email. Your client pays without creating an account.",
    color: "from-indigo-500 to-purple-600",
    iconBg: "bg-indigo-100 text-indigo-600",
    span: "md:col-span-1",
    image: null,
  },
  {
    icon: Smartphone,
    title: "Mobile Money",
    description:
      "MTN & Airtel payments across Uganda, Kenya, Tanzania, and Rwanda.",
    color: "from-emerald-500 to-green-600",
    iconBg: "bg-emerald-100 text-emerald-600",
    span: "md:col-span-1",
    image: null,
  },
  {
    icon: CreditCard,
    title: "Card Payments",
    description:
      "Accept Visa & Mastercard on a secure, branded checkout page.",
    color: "from-purple-500 to-pink-600",
    iconBg: "bg-purple-100 text-purple-600",
    span: "md:col-span-1",
    image: null,
  },
  {
    icon: Wallet,
    title: "Multi-Currency Wallet",
    description:
      "Separate balances for UGX, USD, KES, and more. Track every transaction with transparent fee breakdowns.",
    color: "from-orange-500 to-amber-600",
    iconBg: "bg-orange-100 text-orange-600",
    span: "md:col-span-1",
    image: null,
  },
  {
    icon: ArrowUpCircle,
    title: "Instant Withdrawals",
    description:
      "Withdraw to any mobile money number in seconds. Enter your phone, amount, and you're done.",
    color: "from-teal-500 to-emerald-600",
    iconBg: "bg-teal-100 text-teal-600",
    span: "md:col-span-2",
    image: "/images/bento-wallet.svg",
  },
];

export default function BentoGrid() {
  return (
    <section className="py-16 md:py-24 bg-white" id="bento">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs md:text-sm font-semibold mb-3 md:mb-4">
            Platform
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
            One platform,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              everything you need
            </span>
          </h2>
          <p className="text-sm md:text-lg text-slate-600">
            From creating invoices to collecting payments and withdrawing your
            money — it all happens here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {bentoItems.map((item, index) => (
            <div
              key={index}
              className={`${item.span} group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8 hover:shadow-lg transition-all duration-300`}
            >
              {/* Gradient accent */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color}`}
              />

              <div className="relative z-10">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${item.iconBg} flex items-center justify-center mb-4`}
                >
                  <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-base md:text-xl font-semibold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-md">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
