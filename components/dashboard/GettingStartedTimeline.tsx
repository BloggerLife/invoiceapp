"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Building,
  FileText,
  Send,
  CreditCard,
  Wallet,
  ArrowUpCircle,
} from "lucide-react";
import Link from "next/link";

interface TimelineStep {
  title: string;
  description: string;
  icon: React.ElementType;
  href?: string;
  linkText?: string;
}

const TIMELINE_STEPS: Record<string, TimelineStep[]> = {
  dashboard: [
    {
      title: "Set up your brand",
      description:
        "Add your company name, logo, and contact details so your invoices look professional.",
      icon: Building,
      href: "/dashboard/settings/brand",
      linkText: "Go to Brand Settings",
    },
    {
      title: "Create your first invoice",
      description:
        "Fill in the client details, add items, and generate a professional invoice or quotation.",
      icon: FileText,
      href: "/dashboard/invoices/new",
      linkText: "Create Invoice",
    },
    {
      title: "Send it to your client",
      description:
        "Email the invoice directly or copy the payment link so your client can pay online.",
      icon: Send,
    },
    {
      title: "Get paid via Mobile Money or Card",
      description:
        "Your client pays through the payment link. Funds land in your wallet (8% platform fee).",
      icon: CreditCard,
    },
    {
      title: "Withdraw your earnings",
      description:
        "Move money from your wallet to your phone via Mobile Money anytime.",
      icon: ArrowUpCircle,
      href: "/dashboard/wallet",
      linkText: "Go to Wallet",
    },
  ],
  invoices: [
    {
      title: "Choose Invoice or Quotation",
      description:
        "Select the document type from the dropdown at the top of the form. Quotations show 'QUOTATION' on the PDF.",
      icon: FileText,
      href: "/dashboard/invoices/new",
      linkText: "Create New",
    },
    {
      title: "Fill in the details",
      description:
        "Add your client info, line items, tax rates, and any additional charges.",
      icon: Building,
    },
    {
      title: "Preview, download, or print",
      description:
        "Switch to Preview Mode to see the final look. Download the PDF or print directly.",
      icon: FileText,
    },
    {
      title: "Send & get paid",
      description:
        "Email the invoice to your client or copy the payment link. They can pay via Mobile Money or Card.",
      icon: Send,
    },
  ],
  wallet: [
    {
      title: "Send an invoice with a payment link",
      description:
        "Create an invoice and copy the payment link. Share it with your client.",
      icon: FileText,
      href: "/dashboard/invoices/new",
      linkText: "Create Invoice",
    },
    {
      title: "Client pays online",
      description:
        "Your client opens the link and pays via Mobile Money (MTN/Airtel) or Card (Visa/Mastercard).",
      icon: CreditCard,
    },
    {
      title: "Funds arrive in your wallet",
      description:
        "After payment, the amount (minus 8% platform fee) is credited to your wallet instantly.",
      icon: Wallet,
    },
    {
      title: "Withdraw to Mobile Money",
      description:
        "Enter your phone number and amount, then tap Withdraw. Money is sent to your phone.",
      icon: ArrowUpCircle,
    },
  ],
};

export default function GettingStartedTimeline({
  variant = "dashboard",
}: {
  variant?: "dashboard" | "invoices" | "wallet";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const steps = TIMELINE_STEPS[variant];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-gray-900">
            Getting Started
          </span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {steps.length} steps
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          <div className="relative ml-3">
            {/* Vertical line */}
            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200" />

            {steps.map((step, index) => (
              <div key={index} className="relative pl-10 pb-6 last:pb-0">
                {/* Dot */}
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center z-10">
                  <step.icon className="h-3.5 w-3.5 text-blue-600" />
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {index + 1}. {step.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {step.description}
                  </p>
                  {step.href && (
                    <Link
                      href={step.href}
                      className="inline-block mt-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {step.linkText || "Go"} &rarr;
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
