import React from "react";
import {
  Wallet,
  FileText,
  CreditCard,
  Phone,
  ArrowUpCircle,
  Globe,
  Receipt,
  Sparkles,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: {
    type: "new" | "improved" | "fixed";
    title: string;
    description: string;
    icon: React.ElementType;
  }[];
}

const changelog: ChangelogEntry[] = [
  {
    version: "2.0",
    date: "March 2026",
    title: "Payment Collection, Wallet & Quotations",
    description:
      "A major update that turns Invoice Generator Pro into a full payment collection platform. Send invoices, get paid online, and withdraw your earnings.",
    changes: [
      {
        type: "new",
        title: "Collect Payments via Mobile Money & Card",
        description:
          "Your clients can now pay invoices directly through a payment link. Supports MTN/Airtel Mobile Money (via Iotec) and Visa/Mastercard card payments (via Stripe through DGateway).",
        icon: CreditCard,
      },
      {
        type: "new",
        title: "Multi-Currency Wallet",
        description:
          "Every payment you receive lands in your wallet. Supports multiple currencies (UGX, USD, KES, and more). View your balances and full transaction history from the new Wallet dashboard page.",
        icon: Wallet,
      },
      {
        type: "new",
        title: "Mobile Money Withdrawals",
        description:
          "Withdraw your wallet balance to any MTN or Airtel phone number instantly. Enter the amount, your phone number, and tap Withdraw.",
        icon: ArrowUpCircle,
      },
      {
        type: "new",
        title: "Public Payment Links",
        description:
          "Each invoice now has a shareable payment link. Copy it from the invoice detail page or it's automatically included when you email an invoice. Clients can pay without logging in.",
        icon: Globe,
      },
      {
        type: "new",
        title: "Invoice & Quotation Document Types",
        description:
          "Choose between Invoice and Quotation when creating a document. The PDF, preview, print, and email all reflect the selected type with appropriate labels.",
        icon: FileText,
      },
      {
        type: "new",
        title: "DGateway Payment Integration",
        description:
          "We've migrated from Stripe to DGateway as our payment provider, enabling Mobile Money payments across East Africa (Uganda, Kenya, Tanzania, Rwanda) alongside card payments.",
        icon: Phone,
      },
      {
        type: "improved",
        title: "Email Invoices with Pay Now Button",
        description:
          "When you email an invoice, the email now includes a 'Pay Now' button that links directly to the payment page alongside the existing 'View Invoice' button.",
        icon: Receipt,
      },
      {
        type: "improved",
        title: "Pricing Displays Both USD & UGX",
        description:
          "Subscription pricing now shows both USD and UGX amounts so you know exactly what you're paying regardless of payment method.",
        icon: CreditCard,
      },
      {
        type: "fixed",
        title: "Free Plan Limit Updated",
        description:
          "The free plan now allows 1 invoice per day (previously 2). Upgrade to a paid plan for unlimited invoices.",
        icon: FileText,
      },
    ],
  },
];

const typeBadge = {
  new: "bg-green-100 text-green-700",
  improved: "bg-blue-100 text-blue-700",
  fixed: "bg-orange-100 text-orange-700",
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Changelog</h1>
          </div>
          <p className="text-gray-500 text-lg">
            New features, improvements, and fixes for Invoice Generator Pro.
          </p>
        </div>

        {/* Entries */}
        {changelog.map((entry, entryIdx) => (
          <div key={entryIdx} className="mb-16">
            {/* Version header */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-bold bg-blue-600 text-white px-3 py-1 rounded-full">
                v{entry.version}
              </span>
              <span className="text-sm text-gray-400">{entry.date}</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {entry.title}
            </h2>
            <p className="text-gray-600 mb-8">{entry.description}</p>

            {/* Changes */}
            <div className="space-y-6">
              {entry.changes.map((change, changeIdx) => (
                <div
                  key={changeIdx}
                  className="flex gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <change.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${typeBadge[change.type]}`}
                      >
                        {change.type}
                      </span>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {change.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {change.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-500 mb-4">
            Ready to try the new features?
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
          >
            Get Started Free
            <CheckCircle className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
