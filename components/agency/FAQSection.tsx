"use client";

import React, { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "How much does InvoicePro cost?",
    answer:
      "You can create 1 free invoice per day at no cost. The Starter plan is UGX 35,000/month for 5 invoices per day, and the Pro plan is UGX 75,000/month for unlimited invoices. For collecting payments, we charge an 8% platform fee only when you get paid — no monthly fees for that.",
  },
  {
    question: "How do my clients pay an invoice?",
    answer:
      "Every invoice you create gets a shareable payment link. You can send it via WhatsApp, SMS, email, or any channel. Your client opens the link, sees the invoice summary, and pays via Mobile Money (MTN or Airtel) or Card (Visa/Mastercard). No account needed.",
  },
  {
    question: "Which countries and currencies are supported?",
    answer:
      "We support Mobile Money payments across Uganda, Kenya, Tanzania, and Rwanda. The platform supports multiple currencies including UGX, KES, USD, and more. Your wallet holds separate balances per currency.",
  },
  {
    question: "How do I withdraw my money?",
    answer:
      "Go to your Wallet page, select the currency, enter the amount and your mobile money phone number, and hit withdraw. The money is sent to your phone instantly via MTN or Airtel Mobile Money.",
  },
  {
    question: "What is the 8% platform fee?",
    answer:
      "When a client pays your invoice through a payment link, we deduct 8% as a platform fee. This is transparently shown in your wallet transaction history — you see the gross amount, the fee, and the net amount credited. There are no hidden charges.",
  },
  {
    question: "Can I create quotations too?",
    answer:
      "Yes! When creating a document, simply select 'Quotation' from the document type dropdown. The entire preview, PDF download, and email will show 'QUOTATION' instead of 'INVOICE'. All other details remain the same.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. Payments are processed through DGateway, a trusted payment aggregator. All data is encrypted and stored securely. We never store your clients' card details on our servers.",
  },
  {
    question: "Can I use InvoicePro on my phone?",
    answer:
      "Yes! InvoicePro is a Progressive Web App (PWA). You can install it on your phone from the browser and use it like a native app. It works on both Android and iOS.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24 bg-slate-50" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs md:text-sm font-semibold mb-3 md:mb-4">
            <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
            FAQ
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
            Frequently asked questions
          </h2>
          <p className="text-sm md:text-lg text-slate-600">
            Everything you need to know about InvoicePro.
          </p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-shadow hover:shadow-sm"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between px-5 py-4 md:px-6 md:py-5 text-left"
              >
                <span className="text-sm md:text-base font-semibold text-slate-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-200 ${
                  openIndex === index
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 md:px-6 md:pb-5 text-sm md:text-base text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 md:mt-12">
          <p className="text-sm text-slate-500 mb-3">
            Still have questions?
          </p>
          <Link
            href="https://wa.me/256762063160"
            target="_blank"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 text-sm md:text-base"
          >
            <MessageCircle className="w-4 h-4" />
            Chat with us on WhatsApp
          </Link>
        </div>
      </div>
    </section>
  );
}
