import React from "react";
import {
  FileText,
  Link2,
  Wallet,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const showcaseFeatures = [
  {
    badge: "Create",
    title: "Professional Invoices & Quotations in Seconds",
    description:
      "Choose between Invoice or Quotation from a simple dropdown. Fill in the details, preview instantly, and download a branded PDF — complete with your logo, colors, and payment terms.",
    points: [
      "Switch between Invoice and Quotation with one click",
      "Branded PDF with your logo and colors",
      "Auto-generated invoice numbers",
      "Tax calculation and multi-item support",
    ],
    icon: FileText,
    gradient: "from-blue-600 to-indigo-600",
    lightBg: "bg-blue-50",
    reversed: false,
  },
  {
    badge: "Collect",
    title: "Get Paid via Mobile Money & Card",
    description:
      "Every invoice comes with a shareable payment link. Your client opens it, chooses Mobile Money or Card, and pays in under 30 seconds. The money goes straight to your wallet.",
    points: [
      "One-click payment links via WhatsApp, SMS, or email",
      "MTN & Airtel Mobile Money across East Africa",
      "Visa & Mastercard on a secure checkout page",
      "Real-time payment notifications",
    ],
    icon: Link2,
    gradient: "from-emerald-600 to-teal-600",
    lightBg: "bg-emerald-50",
    reversed: true,
  },
  {
    badge: "Withdraw",
    title: "Your Money, Your Phone, Instantly",
    description:
      "All payments land in your multi-currency wallet. When you're ready, withdraw to any mobile money number. Track every transaction with a clear breakdown of the 8% platform fee.",
    points: [
      "Multi-currency wallet (UGX, USD, KES, and more)",
      "Withdraw to any mobile money number",
      "Transparent 8% fee shown in every transaction",
      "Full transaction history with filters",
    ],
    icon: Wallet,
    gradient: "from-orange-600 to-amber-600",
    lightBg: "bg-orange-50",
    reversed: false,
  },
];

export default function FeatureShowcase() {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-flex items-center px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs md:text-sm font-semibold mb-3 md:mb-4">
            How It Works
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
            Three steps to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              getting paid
            </span>
          </h2>
          <p className="text-sm md:text-lg text-slate-600">
            Create. Send. Get paid. It really is that simple.
          </p>
        </div>

        <div className="space-y-16 md:space-y-24">
          {showcaseFeatures.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                feature.reversed ? "md:flex-row-reverse" : "md:flex-row"
              } gap-8 md:gap-16 items-center`}
            >
              {/* Text Side */}
              <div className="flex-1">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 ${feature.lightBg} bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
                >
                  Step {index + 1}: {feature.badge}
                </span>
                <h3 className="text-xl md:text-3xl font-bold text-slate-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-slate-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-slate-700">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual Side */}
              <div className="flex-1 w-full">
                <div
                  className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${feature.gradient} p-1`}
                >
                  <div className="bg-white rounded-xl p-6 md:p-10">
                    <div className="flex items-center justify-center">
                      <div
                        className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl ${feature.lightBg} flex items-center justify-center`}
                      >
                        <feature.icon className="w-10 h-10 md:w-14 md:h-14 text-slate-400" />
                      </div>
                    </div>
                    <div className="mt-6 space-y-2">
                      {feature.points.slice(0, 3).map((_, i) => (
                        <div
                          key={i}
                          className="h-3 rounded-full bg-slate-100"
                          style={{ width: `${85 - i * 15}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 md:mt-20">
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 md:px-8 md:py-4 rounded-xl transition-all shadow-lg hover:shadow-xl text-sm md:text-base group"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
